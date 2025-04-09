import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server } from 'socket.io'

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ProductsGateway {
  // WebSocket gateway for real-time product updates
  // This will handle incoming connections and broadcast updates to clients
  @WebSocketServer()
  private readonly server: Server

  handleProductUpdated() {
    this.server.emit('productUpdated')
  }
}
