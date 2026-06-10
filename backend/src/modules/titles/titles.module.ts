import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Title } from './entities/title.entity';
import { TitlesService } from './titles.service';
import { TitlesController } from './titles.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Title])],
  controllers: [TitlesController],
  providers: [TitlesService],
  exports: [TitlesService],
})
export class TitlesModule {}
