from bottle import route, run, view, static_file


@route('/')
@view('index')
def index():
    return dict()


@route("/<filename>.css")
def stylesheets(filename):
    return static_file('{}.css'.format(filename), root='static')


@route("/<filename>.jpg")
def images(filename):
    return static_file('{}.jpg'.format(filename), root='static')


if __name__ == '__main__':
    run(server="paste", host="0.0.0.0", port=80)
