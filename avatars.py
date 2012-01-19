import md5
for email in ['ck', 'ct', 'cz', 'is', 'ag', 'kc', 'ab', 'ga', 'mh', 'mail']:
    h = md5.md5(email+'@gocept.com').hexdigest()
    print email, 'http://www.gravatar.com/avatar/'+h
