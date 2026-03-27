import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { ApiQuery } from '@nestjs/swagger';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  @ApiQuery({ name: 'sportId', required: false, type: Number })
  findAll(
    @Query('sportId', new ParseIntPipe({ optional: true })) sportId?: number,
  ) {
    if (sportId) {
      return this.teamsService.findBySportId(sportId);
    }
    return this.teamsService.findAll();
  }
}
