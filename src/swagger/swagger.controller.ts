import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { readFileSync } from 'fs';

@Controller()
export class SwaggerController {
  @Get('swagger.json')
  getSwaggerJson(@Res() res: Response) {
    const swaggerJson = readFileSync('./swagger.json', 'utf8');
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=swagger.json');
    res.send(swaggerJson);
  }
}
