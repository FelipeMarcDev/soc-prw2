import { Module } from '@nestjs/common';
import { IncidentsModule } from './modules/incidents/incidents.module';
import { UsersModule } from './modules/users/users.module';
import { PrismaModule } from './shared/infrastructure/database/prisma.module';

@Module({
  imports: [PrismaModule, UsersModule, IncidentsModule],
})
export class AppModule {}
