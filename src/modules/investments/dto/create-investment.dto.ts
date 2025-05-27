import { IsString, IsNumber, IsNotEmpty, Min } from 'class-validator';

export class CreateInvestmentDto {
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @IsNumber()
  @Min(0)
  amount: number;
} 