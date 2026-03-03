import { Body, Controller, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { IdParamDto } from '../common/dto/id-param.dto';

import { DebitDto } from './dto/debit.dto';
import { IDebitResult } from './interfaces/user.interface';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post(':id/debit')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Debit user balance',
    description:
      'Withdraws the specified amount from the user account and records it in payment history.',
  })
  @ApiBody({ type: DebitDto })
  @ApiResponse({
    status: 200,
    description: 'Debit successful',
    schema: { example: { userId: 1, balance: 900.0 } },
  })
  @ApiResponse({ status: 400, description: 'Invalid request body' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 409, description: 'Insufficient balance' })
  @ApiResponse({ status: 429, description: 'Rate limit exceeded' })
  async debit(@Param() { id: userId }: IdParamDto, @Body() dto: DebitDto): Promise<IDebitResult> {
    const { amount } = dto;
    return this.usersService.debit({ userId, amount });
  }
}
