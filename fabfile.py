from fabric.api import run, env,cd, sudo

env.user = 'ok-webfront'

def deploy(repo='origin', branch='master'):
    with cd("live"):
        run("git pull %s %s" % (repo, branch))
    sudo ('restart ok-webfront')
