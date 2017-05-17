import os.path
import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web
import tornado.websocket
import json


class IndexHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("main.html")


class ChatHandler(tornado.websocket.WebSocketHandler):
    # 相当于静态成员
    users = dict()

    def open(self):
        print(self.get_argument("username"))
        ChatHandler.users[id(self)] = [self]

    def on_message(self, message):
        json_object = json.loads(message)

        if len(ChatHandler.users[id(self)]) == 1:
            ChatHandler.users[id(self)].append(json_object["user"])

        for key, value in ChatHandler.users.items():
            if len(value) > 1:
                if value[1] == json_object["touser"]:
                    value[0].write_message(json_object["message"])

    def on_close(self):
        ChatHandler.users.pop(id(self))

static_path = os.path.join(os.path.dirname(__file__), "static")

if __name__ == '__main__':
    app = tornado.web.Application(
        handlers=[
            (r"/", IndexHandler),
            (r"/ws", ChatHandler)
        ], static_path=static_path
    )
    http_server = tornado.httpserver.HTTPServer(app)
    http_server.listen(12345)
    tornado.ioloop.IOLoop.instance().start()
