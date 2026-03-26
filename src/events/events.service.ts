import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async create(createEventDto: CreateEventDto) {
    return this.prisma.event.create({
      data: {
        ...createEventDto,
        event_date: new Date(`${createEventDto.event_date}T00:00:00.000Z`),
      },
      include: {
        sport: true,
        venue: true,
        homeTeam: true,
        awayTeam: true,
      },
    });
  }

  async findAll() {
    return this.prisma.$queryRaw`
    SELECT 
      e.id, 
      e.event_date AS "date", 
      e.event_time AS "time", 
      s.name AS "sport",
      ht.name AS "home_team",
      at.name AS "away_team",
      v.name AS "venue"
    FROM events e 
    INNER JOIN sports s ON e._sport_id = s.id
    INNER JOIN teams ht ON e._home_team_id = ht.id
    INNER JOIN teams at ON e._away_team_id = at.id
    LEFT JOIN venues v ON e._venue_id = v.id
    ORDER BY e.event_date ASC;
  `;
  }

  async findOne(id: number) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        sport: true,
        venue: true,
        homeTeam: true,
        awayTeam: true,
      },
    });

    if (!event) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }

    return event;
  }
}
