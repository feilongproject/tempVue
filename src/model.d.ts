interface SimpleData {
    Rank: number;
    BestRankingPoint: number;
    Hard: string;
    BattleTime: string;
  }
  
  interface SimpleDataResponse {
    Data: SimpleData[];
    Timestamp: number;
  }
  
  interface CharacterDB{
      UniqueId: number;
      StarGrade: number;
      Level: number;
      SlotIndex: number;
      IsAssist: boolean;
      HasWeapon: boolean;
  }
  
  interface RaidTeamDetail{
      TryNumber: number;
      MainCharacterDBs: CharacterDB[];
      SupportCharacterDBs: CharacterDB[];
  }
  
  interface ComplexData{
      RepresentCharacterUniqueId: number;
      Level: number;
      Nickname: string;
      Tier: number;
      Rank: number;
      BestRankingPoint: number;
      Hard: string;
      BattleTime: string;
      RaidTeamDetail: RaidTeamDetail[];
  }
  
  interface ComplexDataResponse{
      Data: ComplexData[];
      Timestamp: number;
  }
  
  interface HardCountData{
      Hard: string;
      Count: number;
  }
  
  interface HardCountResponse{
      Data: HardCountData[];
      Timestamp: number;
  }

  interface TierDataTrack{
    Key: number[];
    Value: {
        [key: string]: number[];
    };
  }

  interface TierDataTrackResponse{
    Data : TierDataTrack
  }