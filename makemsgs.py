from subprocess import PIPE, Popen
import os
import re
from itertools import dropwhile

trans_re = re.compile(r"\{\{\#_\}\}\s*(.*?)\s*\{\{/_\}\}")

def pythonize(src, fn):
    return trans_re.sub(r' gettext("\1") ', src)

def _popen(cmd):
    """
    Friendly wrapper around Popen for Windows
    """
    p = Popen(cmd, shell=True, stdout=PIPE, stderr=PIPE, close_fds=os.name != 'nt', universal_newlines=True)
    return p.communicate()

if __name__=="__main__":
    print "processing language he"
    wrap = ''
    domain = 'mustache'
    basedir = os.path.join('locale', 'he', 'LC_MESSAGES')
    if not os.path.isdir(basedir):
        os.makedirs(basedir)

    pofile = os.path.join(basedir, '%s.po' % domain)
    potfile = os.path.join(basedir, '%s.pot' % domain)

    if os.path.exists(potfile):
        os.unlink(potfile)

    for dirpath, dirnames, filenames in os.walk('templates'):
        for file in filenames:
            thefile = file
            orig_file = os.path.join(dirpath, file)
            file_base, file_ext = os.path.splitext(file)
            if file_ext[1:] not in ['mustache', 'html']:
                continue

            src = open(orig_file, "rU").read()
            thefile = '%s.py' % file
            f = open(os.path.join(dirpath, thefile), "w")
            try:
                f.write(pythonize(src, orig_file[2:]))
            finally:
                f.close()
            print 'processing file %s in %s\n' % (file, dirpath)
            cmd = (
                'xgettext -d %s -L Python --keyword=gettext '
                '--from-code UTF-8 '
                '--add-comments=Translators -o - "%s"' % (domain,
                    os.path.join(dirpath, thefile))
            )
            msgs, errors = _popen(cmd)
            if errors:
                if thefile != file:
                    os.unlink(os.path.join(dirpath, thefile))
                if os.path.exists(potfile):
                    os.unlink(potfile)
                raise CommandError(
                    "errors happened while running xgettext on %s\n%s" %
                    (file, errors))
            if msgs:
                if thefile != file:
                    old = '#: ' + os.path.join(dirpath, thefile)[2:]
                    new = '#: ' + orig_file[2:]
                    msgs = msgs.replace(old, new)
                if os.path.exists(potfile):
                    # Strip the header
                    msgs = '\n'.join(dropwhile(len, msgs.split('\n')))
                else:
                    msgs = msgs.replace('charset=CHARSET', 'charset=UTF-8')
                f = open(potfile, 'ab')
                try:
                    f.write(msgs)
                finally:
                    f.close()
            if thefile != file:
                os.unlink(os.path.join(dirpath, thefile))

        if os.path.exists(potfile):
            msgs, errors = _popen('msguniq %s --to-code=utf-8 "%s"' %
                                  (wrap, potfile))
            if errors:
                os.unlink(potfile)
                raise CommandError(
                    "errors happened while running msguniq\n%s" % errors)
            if os.path.exists(pofile):
                f = open(potfile, 'w')
                try:
                    f.write(msgs)
                finally:
                    f.close()
                msgs, errors = _popen('msgmerge %s -q "%s" "%s"' %
                                      (wrap, pofile, potfile))
                if errors:
                    os.unlink(potfile)
                    raise CommandError(
                        "errors happened while running msgmerge\n%s" % errors)

            msgs = msgs.replace(
                "#. #-#-#-#-#  %s.pot (PACKAGE VERSION)  #-#-#-#-#\n" % domain, "")
            f = open(pofile, 'wb')
            try:
                f.write(msgs)
            finally:
                f.close()
            os.unlink(potfile)
