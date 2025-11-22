import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { GoogleMeetLinkService } from './google-meet-link-generation.services';
import GoogleMeetLinkDto from './dto/google-meet-link.dto';

@Controller('google-meet-links')
export class GoogleMeetLinkController {
  constructor(private readonly service: GoogleMeetLinkService) {}

  // Create Google Meet Link
  @Post('handleGoogleMeetLink')
  create(@Body() dto: GoogleMeetLinkDto) {
    return this.service.create(dto);
  }

  // Get all records
  @Get('editGoogleMeetLink')
  findAll() {
    return this.service.findAll();
  }

  // Get single record by ID
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  // Update record
  @Put(':id')
  update(@Param('id') id: number, @Body() dto: GoogleMeetLinkDto) {
    return this.service.update(id, dto);
  }

  // Delete record
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }
}
