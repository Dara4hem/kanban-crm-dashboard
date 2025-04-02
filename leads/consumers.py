import json
from channels.generic.websocket import AsyncWebsocketConsumer

class LeadConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("leads", self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("leads", self.channel_name)

    async def receive(self, text_data):
        print("📨 Received:", text_data)
        await self.channel_layer.group_send(
            "leads",
            {
                "type": "broadcast_message",
                "message": json.loads(text_data)
            }
        )

    async def broadcast_message(self, event):
        await self.send(text_data=json.dumps({
            "message": event["message"]
        }))

    async def send_lead_update(self, event):
        await self.send(text_data=json.dumps({
            "type": "lead_update",
            "lead": event["lead"]
        }))
