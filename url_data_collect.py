from selenium import webdriver
from selenium.webdriver.common.by import By
from time import sleep

f = open('url_data.txt', 'a')

driver = webdriver.Chrome('C:\ishikawaritsuki\chromedriver')

for i in range(67,90):
    URL = "https://www.kurashiru.com/recipes?page=" + str(i+1)
    driver.get(URL)
    for j in range(30):
        xpath = '//*[@id="partial_spa"]/div[1]/div/div/article/ul/li[{}]/div/a'.format(j+1)
        elem_a = driver.find_element(By.XPATH,xpath)
        f.write(elem_a.get_attribute('href'))
        f.write("\n")

f.close()

