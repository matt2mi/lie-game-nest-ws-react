import {Get, Controller, Res} from '@nestjs/common';
import * as path from "path";

@Controller()
export class AppController {
    @Get()
    root(@Res() res): string {
        return res.render(path.join(__dirname + '/index.html'));
    }
}
