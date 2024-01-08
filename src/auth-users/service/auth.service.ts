import { Injectable, Logger } from '@nestjs/common';
import { User } from 'src/auth-users/auth-users.entity';
import { BaseResponse } from 'src/utils/dto/response.dto';
import { DateUtilService } from 'src/utils/service/dates/dates.service';
import { ResponseUtilService } from 'src/utils/service/responses/responses.service';
import {
  LoginRqDto,
  LoginRsDTO,
  RefreshAccessTokenRqDto,
  RefreshAccessTokenRsDto,
  RegisterRqDto,
  RegisterRsDTO,
  ResetPasswordRqDto,
} from '../auth-users.dto';
import { JwtService } from './jwt.service';
import { UsersDao } from '../dao/users.dao';

@Injectable()
export class AuthService {
  constructor(
    private readonly responseUtil: ResponseUtilService,
    private readonly dateUtil: DateUtilService,
    private readonly jwtService: JwtService,
    private readonly usersDao: UsersDao,
  ) {}

  private readonly logger = new Logger(AuthService.name);

  private async validateRegisterRequest(request: RegisterRqDto) {
    const existingUser = await this.usersDao.findByEmail(request.email);
    if (existingUser) {
      return this.responseUtil.errorConflictResponse(['e-mail already exist']);
    }

    return null;
  }

  public async register(
    request: RegisterRqDto,
  ): Promise<BaseResponse<RegisterRsDTO>> {
    this.logger.log(`${AuthService.name} register account: ${request.email}`);

    const validateError = await this.validateRegisterRequest(request);
    if (validateError) {
      return validateError;
    }

    const user = this.constructUserData(request);
    // let createdUser;

    try {
      await this.usersDao.create(user);
      // createdUser = await this.usersDao.create(user);
    } catch {
      return this.responseUtil.errorConflictResponse(['Failed to register']);
    }

    // send otp to email
    // await this.mailService.sendEmail(
    //   [createdUser.email],
    //   {
    //     name: createdUser.name,
    //     email: createdUser.email,
    //   },
    //   EMAIL_TEMPLATE.ACCOUNT_REGISTRATION,
    // );

    return this.responseUtil.successCreatedResponse({
      name: request.name,
      email: request.email,
      phoneNumber: request.phoneNumber,
    });
  }

  public async login({
    email,
    password,
  }: LoginRqDto): Promise<BaseResponse<LoginRsDTO>> {
    this.logger.log(`${AuthService.name} login account: ${email}`);

    const user: User | null = await this.usersDao.findByEmail(email);
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
    user.createBy = AuthService.name;
    user.created = this.dateUtil.nowJakartaTime();
    user.lastUpdateBy = AuthService.name;
    user.lastUpdated = this.dateUtil.nowJakartaTime();
    user.email = userData.email;
    user.name = userData.name;
    user.phoneNumber = userData.phoneNumber;
    user.password = this.jwtService.encodePassword(userData.password);

    return user;
  }

  public async refreshAccessToken({
    refreshToken,
  }: RefreshAccessTokenRqDto): Promise<BaseResponse<RefreshAccessTokenRsDto>> {
    this.logger.log(`${AuthService.name} refresh access token`);

    // get user id from refresh token
    let decode: any;
    try {
      // validate token
      decode = await this.jwtService.validate(refreshToken);
    } catch (error) {
      this.logger.warn(
        `${AuthService.name} refresh token invalid, refresh token ${refreshToken}`,
      );
      return this.responseUtil.errorBadRequestResponse([
        'refresh token invalid',
      ]);
    }

    // get user data
    const user: User | null = await this.usersDao.findById(decode.id);
    if (!user) {
      this.logger.warn(
        `${AuthService.name} user not found, user id ${decode.id}`,
      );
      return this.responseUtil.errorNotFoundResponse(['user not found']);
    }

    // generate access token and refresh token
    const token = this.jwtService.generateToken(user);

    // set existing refresh token to response
    token.refreshToken = refreshToken;

    return this.responseUtil.successOkResponse(token);
  }

  public async resetPassword(request: ResetPasswordRqDto) {
    this.logger.log(
      `${AuthService.name} reset password, email ${request.email}`,
    );

    // get user data
    const user: User | null = await this.usersDao.findByEmail(request.email);
    if (!user) {
      this.logger.log(
        `${AuthService.name} user not found, user id ${request.email}`,
      );
      return this.responseUtil.errorNotFoundResponse(['user not found']);
    }

    // validate password
    if (request.password !== request.confirmationPassword) {
      this.logger.log(
        `${AuthService.name} password and confirmation password not match, user id ${user.id}`,
      );
      return this.responseUtil.errorBadRequestResponse([
        'password and confirmation password not match',
      ]);
    }

    // validate otp
    const otp = await this.usersDao.getOtpByUserId(user.id);
    if (!otp || otp !== request.otp) {
      this.logger.log(`${AuthService.name} otp invalid, user id ${user.id}`);
      return this.responseUtil.errorBadRequestResponse(['otp invalid']);
    }

    // encrypt password
    const encryptedPassword = this.jwtService.encodePassword(request.password);

    // update password
    await this.usersDao.updatePassword(
      user.id,
      encryptedPassword,
      AuthService.name,
    );

    // delete otp
    await this.usersDao.deleteOtpByUserId(user.id);

    return this.responseUtil.successOkResponse('password updated');
  }

  public async requestOtp(email: string) {
    this.logger.log(`${AuthService.name} request otp, email ${email}`);

    const user: User | null = await this.usersDao.findByEmail(email);
    if (!user) {
      this.logger.warn(
        `${AuthService.name} user not found, user email ${email}`,
      );
      return this.responseUtil.errorNotFoundResponse(['user not found']);
    }

    // generate otp with 6 digit random number
    const otp = Math.floor(100000 + Math.random() * 900000);

    // save otp to database
    await this.usersDao.saveOtpByUserId(user.id, otp.toString());

    // send otp to email
    // await this.mailService.sendEmail(
    //   [user.email],
    //   {
    //     name: user.name,
    //     otp: otp.toString(),
    //   },
    //   EMAIL_TEMPLATE.REQUEST_OTP,
    // );

    return this.responseUtil.successOkResponse('OTP sent to email');
  }
}
