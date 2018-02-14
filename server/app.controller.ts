import { Controller, Get, Res } from '@nestjs/common';

@Controller()
export class AppController {
    @Get()
    root(@Res() res): string {
        return res.render('/Users/mathieudeumie/projets/github/nest-api-ws/build/index.html');
    }
}
