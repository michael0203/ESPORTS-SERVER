import express, { request, response } from 'express';
import cors from 'cors'
import {PrismaClient} from '@prisma/client'
import { HourToMinutes } from './utils/convert-hour-to-minutes';
import { MinutesToHour } from './utils/Convert-minutes-to-hours';

const prisma = new PrismaClient({
    log:['query']
})

const app = express()
app.use(express.json())
app.use(cors())

/*
* Query: uso do ? exemplo: filtros, paginação
* Rout:  url...
* Body:  enviar varias informações de ua vez
*/

// HTTP methods / API RESTful / HTTP Codes
// GET, POST, PUT {editando}, PATH {altera informação especifica}, DELETE

// www.minhaapi.com/ads

app.get("/games", async (request, response) => {
    const games = await prisma.game.findMany({
      include: {
        _count: {
          select: {
            ads: true,
          },
        },
      },
    });
  
    return response.json(games);
  });
  
app.get('/games/:id/ads', async (request, response) => {

    const gameId = request.params.id;
    const ads  = await prisma.ad.findMany({

        select: {
            id:              true,
            name:            true,
            weekDays:        true,
            useVoiceChannel: true,
            yearsPlaying:    true,
            hourStart:       true,
            hourEnd:         true,
        },

        where: {
            gameId,
        },
        orderBy: {
            createdAt: 'desc',
        }
    })

    return response.json(ads.map(ad =>{
        return {
            ...ad,
            weekDays:  ad.weekDays.split(','),
            hourStart: MinutesToHour(ad.hourStart),
            hourEnd:   MinutesToHour(ad.hourEnd),
        }
    }))
})

app.get('/ads/:id/discord', async  (request, response) => {

    const adId = request.params.id;

    const ad = await prisma.ad.findUniqueOrThrow({
        
        select:{
            discord: true,
        },
        where:{
            id: adId
        }

    })

    return response.json({
        discord: ad.discord
    })
})

app.post('/create/game', async (request, response) => {
    const body = request.body;

    const createGame = await prisma.game.create({
        data:{
         id:     body.id,
         title:  body.title,
         banner: body.banner
        } 
     })

     return response.status(201).json(createGame)
})

app.post('/game/:id/ads', async  (request, response) => {
    const gameId = request.params.id;
    const body   = request.body;
    console.log(body);

    const ad = await prisma.ad.create({
      data: {
        gameId,
        name:            body.name,
        yearsPlaying:    body.yearsPlaying,
        discord:         body.discord,
        weekDays:        body.weekDays.join(','),
        hourStart:       HourToMinutes(body.hourStart),
        hourEnd:         HourToMinutes(body.hourEnd),
        useVoiceChannel: body.useVoiceChannel
      }
    })

    return response.status(201).json(ad)
})

app.listen(3333)