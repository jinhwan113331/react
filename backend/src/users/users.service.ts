import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class UsersService {
  async getSummonerData(prefix: string, suffix: string, apiId: string): Promise<any> {
    try {
      console.log('getSummonerData called with:', { prefix, suffix, apiId });
      const response = await axios.get(`https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${prefix}/${suffix}?api_key=${apiId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching summoner data:', error);
      throw new Error('Failed to fetch summoner data');
    }
  }

  async getProfileData(userId: string, apiId: string): Promise<any> {
    try {
      console.log('getProfileData called with:', { userId, apiId });
      const response = await axios.get(`https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${userId}?api_key=${apiId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching profile data:', error);
      throw new Error('Failed to fetch profile data');
    }
  }

  async getMatchIds(userId: string, apiId: string): Promise<any> {
    try {
      console.log('getProfileData called with:', { userId, apiId });
      const response = await axios.get(`https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${userId}/ids?start=0&count=20&api_key=${apiId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching profile data:', error);
      throw new Error('Failed to fetch profile data');
    }
  }
}