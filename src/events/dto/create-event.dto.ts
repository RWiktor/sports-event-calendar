import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateEventDto {
  @IsDateString()
  event_date: string;

  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'event_time must be in HH:mm format (e.g. 18:30)',
  })
  event_time: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  sportId: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  venueId?: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  homeTeamId: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  awayTeamId: number;
}
