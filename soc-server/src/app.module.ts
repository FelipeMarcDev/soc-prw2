import { Module } from '@nestjs/common';
import { IncidentsModule } from './modules/incidents/incidents.module';
import { PrismaModule } from './shared/infrastructure/database/prisma.module';

@Module({
  imports: [PrismaModule, IncidentsModule],
})
export class AppModule {}
