import { Controller, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('api/summoners')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('fetch')
  async fetchSummonerData(@Query('prefix') prefix: string, @Query('suffix') suffix: string, @Query('apiId') apiId: string) {
    console.log('fetchSummonerData called with:', { prefix, suffix, apiId });
    const data = await this.usersService.getSummonerData(prefix, suffix, apiId);
    return { data };
  }

  @Get('data')
  async fetchData(@Query('userId') userId: string, @Query('apiId') apiId: string) {
    console.log('fetchData called with:', { userId, apiId });
    const data = await this.usersService.getProfileData(userId, apiId);
    return { data };
  }

  @Get('matchId')
  async fetchMatchIds(@Query('userId') userId: string, @Query('apiId') apiId: string) {
    console.log('fetchData called with:', { userId, apiId });
    const data = await this.usersService.getMatchIds(userId, apiId);
    return { data };
  }
}