import { PSEService, PSEBankResponse } from '../../../infrastructure/services/PSEService';

export interface GetPSEBanksOutput {
  banks: PSEBankResponse[];
}

export class GetPSEBanksUseCase {
  constructor(private readonly pseService: PSEService) {}

  async execute(): Promise<GetPSEBanksOutput> {
    try {
      const banks = await this.pseService.getBankList();
      
      return {
        banks: banks
      };
    } catch (error) {
      console.error('Error getting PSE banks:', error);
      throw new Error('Failed to get PSE bank list');
    }
  }
} 