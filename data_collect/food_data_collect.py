import re
from urllib import request
from lxml import etree

def delete_quotation(str):
    pattern = r'\([^()]*\)'
    new_str = re.sub(pattern, '', str)
    return new_str

f = open('new_url_data.txt', 'r')
f2 = open('food_data.txt', 'w')
f3 = open('food_list.txt', 'w')

data_dic = {}
datalist = f.readlines()
datalist = list(set(datalist))
datalist.sort()
food = []
url_num = 1

for url in datalist:
    print(url_num)
    #url = datalist[i]
    html = request.urlopen(url)
    contents = html.read()
    htmltxt = contents.decode()
    et = etree.fromstring(htmltxt, parser=etree.HTMLParser())
    
    food_li = url.replace('\n','')
    title_xpath = '//*[@id="videos_show"]/div/main/article[1]/article/div[2]/h1'
    title_element = et.xpath(title_xpath)[0]
    write_title = title_element.text.split("　")
    food_li += ',' + write_title[0].replace('\n','')
    
    img_xpath = '//*[@id="videos_show"]/div/main/article[1]/article/div[1]/div/video'
    img_element = et.xpath(img_xpath)[0]
    food_li += ',' + (img_element.get('poster'))
    
    stars_xpath = '//*[@id="videos_show"]/div/main/div/article[1]/h2/div/div[2]'
    try:
        stars_element = et.xpath(stars_xpath)[0]
    except IndexError:
        stars_element = str(-1.0)
    else:
        stars_element = float(et.xpath(stars_xpath)[0].text)
    food_li += ',' + str(stars_element)
    
    cook_time_xpath = '//*[@id="videos_show"]/div/main/article[1]/article/p[3]/text()'
    try:
        cook_time_element = et.xpath(cook_time_xpath)[0]
    except IndexError:
        cook_time_element = 99999999999
    else:
        cook_time_element_text = et.xpath(cook_time_xpath)[0]
        cook_time_element = re.sub(r"\D", "", cook_time_element_text)
    food_li += ',' + (cook_time_element)
    
    cook_cost_xpath = '//*[@id="videos_show"]/div/main/article[1]/article/p[4]/text()'
    try:
        cook_cost_element = et.xpath(cook_cost_xpath)[0]
    except IndexError:
        cook_cost_element = 99999999999
    else:
        cook_cost_element_text = et.xpath(cook_cost_xpath)[0]
        cook_cost_element = re.sub(r"\D", "", cook_cost_element_text)
    food_li += ',' + (cook_cost_element)
    
    food_len_xpath = '//*[@id="videos_show"]/div/main/article[1]/article/section[1]/ul/li'
    element_len = len(et.xpath(food_len_xpath))

    for i in range(element_len):
        food_xpath = '//*[@id="videos_show"]/div/main/article[1]/article/section[1]/ul/li[{}]/a/text()'.format(i+1)
        try:
            element = et.xpath(food_xpath)[0]
        except IndexError:
            print("")
        else:
            element = et.xpath(food_xpath)[0].split(" ")[12]
            modify_element = delete_quotation(element)
            food_li += ',' + modify_element.replace('\n','')
            food.append(modify_element.replace('\n',''))
    f2.write(food_li+'\n')
    '''
    if(url_num>=1000):
        break
    '''
    url_num += 1
    
    

food = list(set(food))
food.sort()
for item in food:
    f3.write(item+'\n')

f.close()
f2.close()
f3.close()