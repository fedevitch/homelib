import { NextApiRequest, NextApiResponse } from "next";
import { Server as ServerIO } from "socket.io";
import { Server as NetServer } from "http";
import { NextApiResponseServerIO } from "../../components/schemas/apiResponseIO";
import { socketInit } from "../../services/scanner";
import { env } from 'process';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponseServerIO
  ) {
    if (res.socket.server.io) {
        console.log('Socket is already running')
    } else {
        console.log('Socket is initializing')
        const httpServer: NetServer = res.socket.server as any;
        const io = new ServerIO(httpServer, {
            path: "/api/scanner",
        });
        res.socket.server.io = io;

        io.on('connection', socket => socketInit(socket, io))
    }
    res.json({ scannerLaunched: env.scannerLaunched === '1' })    
}