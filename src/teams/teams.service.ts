import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TeamsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.team.findMany();
  }

  async findBySportId(sportId: number) {
    return this.prisma.team.findMany({
      where: { sportId },
    });
  }
}
