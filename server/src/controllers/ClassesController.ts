import { Request, Response } from 'express';

import db from '../database/connection';
import convertHourToMinutes from '../utils/convertHourToMinutes';

interface ScheduleItem {
  week_day: number;
  from: string;
  to: string;
}

export default class ClassesController {

  async index(request: Request, response: Response) {
    const filters = request.query;

    const subject = filters.subject as string;
    const week_day = filters.week_day as string;
    const time = filters.time as string;

    if (!filters.week_day || !filters.subject || !filters.time ){
      const classes = await db('classes')
      .join('users', 'classes.user_id', '=', 'users.id')
      .select(['classes.*', 'users.*']);
      
      return response.json(classes);
    }

    const timeInMinutes = convertHourToMinutes(time);

    console.log('timeInMinutes', timeInMinutes);

    const classes = await db('classes')
      .whereExists(function(){
        this.select('class_schedule.*')
          .from('class_schedule')
          .whereRaw('`class_schedule`.`class_id` = `classes`.id')
          .whereRaw('`class_schedule`.`week_day` = ??', [Number(week_day)])
          .whereRaw('`class_schedule`.`from` <= ??', [timeInMinutes])
          .whereRaw('`class_schedule`.`to` > ??', [timeInMinutes])
      })
      .where('classes.subject', '=', subject)
      .join('users', 'classes.user_id', '=', 'users.id')
      .select(['classes.*', 'users.*']);

    return response.json(classes);

  }

  async create(request: Request, response: Response) {
    const {
      name,
      avatar,
      whatsapp,
      bio,
      subject,
      cost,
      schedule
    } = request.body;
  
    // Utiliza transaction para caso aconteca algum erro
    // não faça nenhuma alteracao no banco de dados
    const trx = await db.transaction();
  
    try {
  
      // Insere usuário
      const insertedUsersIds = await trx('users').insert({
        name,
        avatar,
        whatsapp,
        bio,
      });
      
      // Prepara para insercao da class
      const user_id = insertedUsersIds[0];
      const insertedClassesIds = await trx('classes').insert({
        subject,
        cost,
        user_id
      });
      
      // Prepara para insercao do schedule
      const class_id = insertedClassesIds[0];
      const classSchedule = schedule.map((scheduleItem: ScheduleItem) => {
        return {
          class_id,
          week_day: scheduleItem.week_day,
          from: convertHourToMinutes(scheduleItem.from),
          to: convertHourToMinutes(scheduleItem.to),
        }
      }) 
      await trx('class_schedule').insert(classSchedule);
  
      // Executa todas os comandos com o transaction
      await trx.commit();
  
      return response.send(201);
  
    } catch (err) {
      console.log("err: ", err);
  
      // Caso tenha feito algo no banco de dados
      // o rollback remove todas essas alteracoes
      await trx.rollback();
      return response.status(400).json({
        error: 'Unexpected error while creating new class'
      })
  
    }
    
  }

}