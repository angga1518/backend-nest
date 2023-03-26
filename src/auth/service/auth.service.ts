import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { BaseResponse } from 'src/utils/dto/response.dto';
import { DateUtilService } from 'src/utils/service/dates/dates.service';
import { ResponseUtilService } from 'src/utils/service/responses/responses.service';
import { Repository } from 'typeorm';
import {
  GoogleAuthDto,
  GoogleAuthResponse,
  LoginRqDto,
  LoginRsDTO,
  RefreshAccessTokenRqDto,
  RefreshAccessTokenRsDto,
  RegisterRqDto,
  RegisterRsDTO,
  Token,
} from '../auth.dto';
import { JwtService } from './jwt.service';

@Injectable()
export class AuthService {
  private className = 'AuthService';
  constructor(
    private readonly responseUtil: ResponseUtilService,
    private readonly dateUtil: DateUtilService,
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
  ) {}

  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

  private readonly logger = new Logger(AuthService.name);

  public async register(
    request: RegisterRqDto,
  ): Promise<BaseResponse<RegisterRsDTO>> {
    this.logger.log(`${this.className} register account: ${request.email}`);

    const user = this.constructUserData(request);

    try {
      await this.userRepository.save(user);
    } catch {
      return this.responseUtil.errorConflictResponse(['e-mail already exist']);
    }

    return this.responseUtil.successCreatedResponse({
      name: request.name,
      email: request.email,
      phone_number: request.phone_number,
    });
  }

  public async login({
    email,
    password,
  }: LoginRqDto): Promise<BaseResponse<LoginRsDTO>> {
    this.logger.log(`${this.className} login account: ${email}`);

    const user: User | null = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      return this.responseUtil.errorNotFoundResponse(['account not found']);
    }

    // validate password
    const isPasswordValid: boolean = this.jwtService.isPasswordValid(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      return this.responseUtil.errorBadRequestResponse(['wrong password']);
    }

    // generate access token and refresh token
    const token = this.jwtService.generateTokenWithRefreshToken(user);

    return this.responseUtil.successOkResponse(token);
  }

  private constructUserData(userData: RegisterRqDto): User {
    const user = new User();
    user.create_by = this.className;
    user.created = this.dateUtil.nowJakartaTime();
    user.last_update_by = this.className;
    user.last_updated = this.dateUtil.nowJakartaTime();
    user.email = userData.email;
    user.name = userData.name;
    user.phone_number = userData.phone_number;
    user.password = this.jwtService.encodePassword(userData.password);
    user.image_url = userData.image_url;

    return user;
  }

  public async refreshAccessToken({
    refresh_token,
  }: RefreshAccessTokenRqDto): Promise<BaseResponse<RefreshAccessTokenRsDto>> {
    this.logger.log(`${this.className} refresh access token`);

    // get user id from refresh token
    let decode: any;
    try {
      // validate token
      decode = await this.jwtService.validate(refresh_token);
    } catch (error) {
      this.logger.warn(
        `${this.className} refresh token invalid, refresh token ${refresh_token}`,
      );
      return this.responseUtil.errorBadRequestResponse([
        'refresh token invalid',
      ]);
    }

    // get user data
    const user: User | null = await this.userRepository.findOne({
      where: { id: decode.id },
    });
    if (!user) {
      this.logger.warn(
        `${this.className} user not found, user id ${decode.id}`,
      );
      return this.responseUtil.errorNotFoundResponse(['user not found']);
    }

    // generate access token and refresh token
    const token = this.jwtService.generateToken(user);

    // set existing refresh token to response
    token.refresh_token = refresh_token;

    return this.responseUtil.successOkResponse(token);
  }

  private async fetchGoogleAuthData(
    access_token: string,
  ): Promise<GoogleAuthResponse | null> {
    return this.httpService.axiosRef
      .get<GoogleAuthResponse>('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      .then((res) => res.data)
      .catch(() => null);
  }

  public async googleAuth({
    access_token,
  }: GoogleAuthDto): Promise<BaseResponse<LoginRsDTO>> {
    const data = await this.fetchGoogleAuthData(access_token);

    if (!data || data.error) {
      return this.responseUtil.errorBadRequestResponse([
        'access token invalid',
      ]);
    }

    this.logger.log(
      `${this.className} google auth account: ${JSON.stringify(data)}`,
    );

    if (!data.verified_email) {
      return this.responseUtil.errorBadRequestResponse(['email not verified']);
    }

    let user: User | null = await this.userRepository.findOne({
      where: { email: data.email },
    });
    if (!user) {
      // Regis flow
      user = this.constructUserDataGoogleAuth(
        data.email,
        data.name,
        data.picture,
      );

      try {
        user = await this.userRepository.save(user);
      } catch {
        return this.responseUtil.errorConflictResponse([
          'e-mail already exist',
        ]);
      }
    }

    const token: Token = await this.jwtService.generateTokenWithRefreshToken(
      user,
    );

    return this.responseUtil.successOkResponse({
      token: token,
    });
  }

  private constructUserDataGoogleAuth(
    email: string,
    name: string,
    image_url: string,
  ): User {
    const user = new User();
    user.create_by = this.className;
    user.created = this.dateUtil.nowJakartaTime();
    user.last_update_by = this.className;
    user.last_updated = this.dateUtil.nowJakartaTime();
    user.email = email;
    user.name = name;
    user.image_url = image_url;

    return user;
  }
}
