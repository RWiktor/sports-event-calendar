import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventsModule } from './events/events.module';
import { PrismaModule } from './prisma/prisma.module';
import { SportsModule } from './sports/sports.module';
import { TeamsModule } from './teams/teams.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    EventsModule,
    SportsModule,
    TeamsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
