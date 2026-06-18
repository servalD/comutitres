import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from './shared/decorators/public.decorator';

@ApiTags('health')
@Controller('health')
export class HealthController {
  @Public()
  @Get()
  @ApiOperation({ summary: 'Vérification de santé du service' })
  @ApiOkResponse({
    schema: { properties: { status: { type: 'string', example: 'ok' } } },
  })
  check(): { status: string } {
    return { status: 'ok' };
  }
}
