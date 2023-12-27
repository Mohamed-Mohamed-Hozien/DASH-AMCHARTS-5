import csv
from datetime import datetime

myFile = open('Data.csv', 'r')
reader = csv.DictReader(myFile)
myList = list()
for dictionary in reader:
    myList.append(dictionary)
print("The list of dictionaries is:")
print(myList)
