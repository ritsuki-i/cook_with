from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException
import re

def delete_quotation(str):
    pattern = r'\([^()]*\)'
    new_str = re.sub(pattern, '', str)
    return new_str

f = open('url_data.txt', 'r')
f2 = open('food_data.txt', 'w')
driver = webdriver.Chrome('C:\ishikawaritsuki\chromedriver')
data_dic = {}
datalist = f.readlines()

for i in range(2000):
    food_li = []
    url = datalist[i]
    driver.get(url)
    food_li.append(url)
    title_xpath = '//*[@id="videos_show"]/div/main/article[1]/article/div[2]/h1'
    title_element = driver.find_element(By.XPATH,title_xpath)
    write_title = title_element.text.split("　")
    food_li.append(write_title[0])
    food_xpath = '//*[@id="videos_show"]/div/main/article[1]/article/section[1]/ul'
    element = driver.find_element(By.XPATH,food_xpath)
    for i in range(len(element.text.split("\n"))//2):
        food_xpath = '//*[@id="videos_show"]/div/main/article[1]/article/section[1]/ul/li[{}]/a'.format(i+1)
        try:
            element = driver.find_element(By.XPATH,food_xpath)
        except NoSuchElementException:
            print("no find")
        else:
            element = driver.find_element(By.XPATH,food_xpath)
            modify_element = delete_quotation(element.text)
            f2.write(modify_element+'\n')
            food_li.append(modify_element)
    f2.write(str(food_li)+'\n')
    

f.close()
f2.close()



