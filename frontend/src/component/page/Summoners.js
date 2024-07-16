import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import '../style/Summoners.css';

Chart.register(ArcElement, Tooltip, Legend);

function Summoners() {

  const { prefix, suffix } = useParams();
  const [data, setData] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [timer, setTimer] = useState(0);
  const [lastRefreshTime, setLastRefreshTime] = useState(null);
  const [minutesSinceLastRefresh, setMinutesSinceLastRefresh] = useState(null)
  const [championNames, setChampionNames] = useState([]);
  const [matchIds, setMatchIds] = useState([]);
  const [matchData, setMatchData] = useState(null);
  const [userId, setUserId] = useState(null); 

  const apiId = 'RGAPI-ed9965de-9b60-45ef-a18d-9a6d64eeecdf';

  useEffect(() => {
    const fetchSummonerData = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/summoners/fetch`, {
          params: {
            prefix: prefix,
            suffix: suffix,
            apiId: apiId,
          },
        });
        setUserId(response.data.data.puuid);
      } catch (error) {
        alert('데이터를 불러오는데 실패했습니다.');
      }
    };
    fetchSummonerData();
  }, [prefix, suffix]);

  useEffect(() => {
    if(!userId) return;

    const fetchData = async () => {
      try {
        const response = await axios.get(`https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${userId}?api_key=${apiId}`);
        console.log('fetchData response:', response.data);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error.response ? error.response.data : error.message);
        alert('데이터를 불러오는데 실패했습니다.');
      }
    };


    const fetchChampionData = async () => {
      try {
        const response = await axios.get('http://ddragon.leagueoflegends.com/cdn/14.11.1/data/en_US/champion.json');
        //console.log(response);
      } catch (error) {
        console.error('Error fetching champion data:', error);
      }
    };

    const fetchMatchIds = async () => {
      try {
        const response = await axios.get(`https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${userId}/ids?start=0&count=20&api_key=${apiId}`);
        setMatchIds(response.data);

        const matchesData = [];
        let allChampionNames = [];
        for (const matchId of response.data) {
          try {
            const matchResponse = await axios.get(`https://asia.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${apiId}`);
            matchesData.push(matchResponse.data);

            const championNames = matchResponse.data.info.participants.map(participant => participant.championName);
            allChampionNames = allChampionNames.concat(championNames);
          } catch (matchError) {
            console.error('Error fetching match data:', matchError);
          }
        }

        setMatchData(matchesData);
        setChampionNames(allChampionNames);

      } catch (error) {
        console.error('Error fetching match IDs:', error);
      }
    };
    fetchData();
    fetchChampionData();
    fetchMatchIds();
  }, [userId]);

  useEffect(() => {
    let interval;
    if (isButtonDisabled) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(interval);
            setIsButtonDisabled(false);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isButtonDisabled]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (lastRefreshTime) {
        setMinutesSinceLastRefresh(getMinutesSinceLastRefresh());
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [lastRefreshTime]);

  const handleRefresh = () => {
    setIsButtonDisabled(true);
    setTimer(5);
    setLastRefreshTime(new Date());
    setMinutesSinceLastRefresh(0);
  };

  const getMinutesSinceLastRefresh = () => {
    if (!lastRefreshTime) return null;
    const now = new Date();
    const difference = now - lastRefreshTime;
    const minutes = Math.floor(difference / 60000);
    return minutes <= 0 ? 0 : minutes;
  };

  const getChampionIconUrl = (championName) => {
    return `https://ddragon.leagueoflegends.com/cdn/14.11.1/img/champion/${championName}.png`;
  };

  const killParticipation = (participant, match) => {
    if (!match || !match.info || !match.info.teams) return 0;

    const team = match.info.teams.find(team => team.teamId === participant.teamId);
    if (!team || !team.objectives || !team.objectives.champion) return 0;

    return Math.round((participant.kills + participant.assists) / team.objectives.champion.kills * 100);
  };

  const renderItemIcon = (itemId) => {
    if (!itemId || itemId === 0) {
      return <div className="grey-box" alt="No item"></div>;
    }
    return <img src={`http://ddragon.leagueoflegends.com/cdn/14.11.1/img/item/${itemId}.png`} className="item-icon" alt="Item" />;
  };

  const dataForChart = {
    labels: ['승리', '패배'],
    datasets: [
      {
        data: [6, 14],
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
    labels: {
      display: false,
    }
  };

  return (
    <div className="summoner-container">
      {data ? (
        <div className="summoner-info">
          <div className="summoner-icon-container">
            <img
              src={`http://ddragon.leagueoflegends.com/cdn/14.11.1/img/profileicon/${data.profileIconId}.png`}
              alt="Summoner Icon"
              className="summoner-icon"
            />
            <div className="summoner-level">{data.summonerLevel}</div>
          </div>
          <div className="summoner-details">
            <h1>{prefix} <span className="summoner-tag">#{suffix.toUpperCase()}</span></h1>
            <button className="refresh-button" onClick={handleRefresh} disabled={isButtonDisabled}>
              전적 갱신
            </button>
            {isButtonDisabled && <p>{timer}초 후에 다시 시도해주세요.</p>}
            {!isButtonDisabled && lastRefreshTime && <p>마지막 갱신: {minutesSinceLastRefresh}분 전</p>}
          </div>
        </div>
      ) : (
        <p>데이터를 불러오는 중...</p>
      )}
      <div className="background">
        <div className="recent-games">
          <h2>최근 게임</h2>
          <div className="recent-games-summary">
            <div className="summary-item">
              <div style={{ width: '200px', height: '200px', alignItems: 'center' }}>
                <Doughnut data={dataForChart} />
              </div>
              <p>20전 6승 14패</p>
              <p>킬/데스/어시스트: 7.3 / 10.4 / 17.7</p>
              <p>킬관여: 55%</p>
            </div>
            <div className="summary-item">
              <p>플레이한 챔피언 (최근 20게임)</p>
              <div className="champion-icons">
                <img src={getChampionIconUrl(12)} alt="챔피언1" className="champion-icon" />
                <img src={getChampionIconUrl(13)} alt="챔피언2" className="champion-icon" />
                <img src={getChampionIconUrl(14)} alt="챔피언3" className="champion-icon" />
              </div>
              <p>챔피언1: 50% (1승 1패) 0.77 평점</p>
              <p>챔피언2: 0% (0승 2패) 1.82 평점</p>
              <p>챔피언3: 0% (0승 2패) 1.5 평점</p>
            </div>
            <div className="summary-item">
              <p>선호 포지션 (랭크)</p>
              <p>포지션1: 50%</p>
              <p>포지션2: 30%</p>
              <p>포지션3: 20%</p>
            </div>
          </div>
          {matchData && (
            <div className="match-details-small">
              {matchData.map((match, matchIndex) => (
                match.info.participants
                  .filter(participant => participant.puuid.toUpperCase() === userId.toUpperCase())
                  .map((participant, index) => (
                    <div key={index} className={`match-summary-small ${participant.win ? 'win-background' : 'lose-background'}`}>
                      <div className="match-info">
                        <p>{match.info.gameMode === 'CLASSIC' ? '솔랭' : (match.info.gameMode === 'CHERRY' ? '아레나' : match.info.gameMode)}</p>
                        <p>하루 전</p>
                        <p>{participant.win ? '승리' : '패배'}</p>
                        <p>{Math.floor(match.info.gameDuration / 60)}분 {match.info.gameDuration % 60}초</p>
                      </div>
                      <div className="participant-info">
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <img src={getChampionIconUrl(participant.championName)} className="champion-icon-big" alt="Champion Icon" />
                        </div>
                        <div className="participant-stats">
                          <p>{participant.kills} / {participant.deaths} / {participant.assists}</p>
                          <p>킬관여 {killParticipation(participant, match)}%</p>
                          <p>제어 와드 {participant.visionWardsBoughtInGame}</p>
                          <p>CS {participant.totalMinionsKilled} ({(participant.totalMinionsKilled / (match.info.gameDuration / 60)).toFixed(1)})</p>
                          <p>{participant.tier} {participant.rank}</p>
                        </div>
                      </div>
                      <div className="participant-items">
                        {renderItemIcon(participant.item0)}
                        {renderItemIcon(participant.item1)}
                        {renderItemIcon(participant.item2)}
                        {renderItemIcon(participant.item3)}
                        {renderItemIcon(participant.item4)}
                        {renderItemIcon(participant.item5)}
                        {renderItemIcon(participant.item6)}
                      </div>
                      <div className="right-panel">
                        <div className="team">
                          {match.info.participants
                            .filter(participant => participant.teamId === 100)
                            .map((participant, index) => (
                              <div key={index} className="participant-summary">
                                <img
                                  src={getChampionIconUrl(participant.championName)}
                                  alt={participant.championName}
                                  className="champion-icon-small"
                                />
                                <div className="summoner-name">{participant.summonerName}</div>
                              </div>
                            ))}
                        </div>
                        <div className="team">
                          {match.info.participants
                            .filter(participant => participant.teamId === 200)
                            .map((participant, index) => (
                              <div key={index} className="participant-summary">
                                <img
                                  src={getChampionIconUrl(participant.championName)}
                                  alt={participant.championName}
                                  className="champion-icon-small"
                                />
                                <div className="summoner-name">{participant.riotIdGameName}</div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  ))
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Summoners;