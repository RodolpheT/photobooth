import urllib2, urllib, os, sys
from bs4 import BeautifulSoup
import time
from shutil import copyfile
import os

while True:
    time.sleep(0.5)
    response = urllib2.urlopen('http://10.5.5.9:8080/videos/DCIM/102GOPRO/')
    html = response.read()
    soup = BeautifulSoup(html)
    dirlist = os.listdir('C:/Users/rtoyer.LAP-PAR-RTOYER2/Desktop/photobooth/photobooth/pictures')
    print "Checking for new content..."
    #time.sleep(1)
    for link in soup.find_all('a'):
        name = link.get('href')
        if ".JPG" in name and name not in dirlist:
            print "Detected new content! Downloading: " + name
            urllib.urlretrieve('http://10.5.5.9:8080/videos/DCIM/102GOPRO/'+name, 'C:/Users/rtoyer.LAP-PAR-RTOYER2/Desktop/photobooth/photobooth/pictures/temp/'+name)
            os.rename('C:/Users/rtoyer.LAP-PAR-RTOYER2/Desktop/photobooth/photobooth/pictures/temp/'+name,'C:/Users/rtoyer.LAP-PAR-RTOYER2/Desktop/photobooth/photobooth/pictures/'+name)
