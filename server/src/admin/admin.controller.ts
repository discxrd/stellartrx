import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateTaskDto } from './dto/create-task.dto';

// TODO: Full rework

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('tasks')
  async getAllTasks(
    @Query('count') count: number,
    @Query('offset') offset: number,
  ) {
    return this.adminService.getAllTasks(count, offset);
  }

  @Post('task')
  async createTask(@Body() task: CreateTaskDto) {
    const result = await this.adminService.createTask(task);
    return { result };
  }

  @Delete('task/:id')
  async deleteTask(@Param('id') id: number) {
    const result = await this.adminService.deleteTask(id);

    return { result };
  }

  @Get('task/:id')
  async getTask(@Param('id') id: number) {
    return this.adminService.getTask(id);
  }

  @Get('users')
  async getAllUsers(
    @Query('count') count: number,
    @Query('offset') offset: number,
  ) {
    return this.adminService.getAllUsers(count, offset);
  }

  @Get('boosts')
  async getAllBoosts(
    @Query('count') count: number,
    @Query('offset') offset: number,
  ) {
    return this.adminService.getAllBoosts(count, offset);
  }

  @Get('withdraws')
  async getAllWithdraws(
    @Query('count') count: number,
    @Query('offset') offset: number,
  ) {
    return this.adminService.getAllWithdraws(count, offset);
  }

  @Get('user/name/:name')
  async getUserByName(@Param('name') name: string) {
    return this.adminService.getUserByName(name);
  }

  @Get('user/id/:id')
  async getUser(@Param('id') id: number) {
    return this.adminService.getUser(id);
  }

  @Get('boost/:id')
  async getBoost(@Param('id') id: number) {
    return this.adminService.getBoost(id);
  }

  @Get('withdraw/:id')
  async getWithdraw(@Param('id') id: number) {
    return this.adminService.getWithdraw(id);
  }

  @Delete('withdraw/:id')
  async cancelWithdraw(@Param('id') id: number) {
    const result = await this.adminService.cancelWithdraw(id);

    return { result };
  }

  @Patch('withdraw/:id')
  async confirmWithdraw(@Param('id') id: number) {
    const result = await this.adminService.confirmWithdraw(id);

    return { result };
  }

  @Delete('withdraw/:id/return')
  async cancelAndReturnWithdraw(@Param('id') id: number) {
    const result = await this.adminService.cancelAndReturnWithdraw(id);

    return { result };
  }

  @Delete('user/:id')
  async banUser(@Param('id') id: number) {
    const result = await this.adminService.deleteUser(id);

    return { result };
  }

  @Get('stats')
  async getStats() {
    return {
      withdraws: await this.adminService.getWithdrawsSum(),
      boosts: await this.adminService.getBoostsSum(),
      users: await this.adminService.getUsersCount(),
      boosts_count: await this.adminService.getBoostsCount(),
      withdraws_count: await this.adminService.getWithdrawsCount(),
      tasks_count: await this.adminService.getTasksCount(),
    };
  }
}
