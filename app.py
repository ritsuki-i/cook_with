from flask import Flask
from flask import render_template , request
import random
import gspread
from oauth2client.service_account import ServiceAccountCredentials
import pandas as pd


app = Flask(__name__)

def float_range(start, stop, step):
    while start < stop:
        yield round(start, 10)  
        start += step

@app.route('/')
def index():
    return render_template(
        'index.html'
    )

@app.route('/nutrition_home')
def nutrition_home():
    nutrition_name={"noname":"欲しい栄養素を選択してください","H":"タンパク質","I":"脂質","J":"炭水化物","K":"食物繊維","L":"カリウム","M":"カルシウム","N":"鉄","O":"亜鉛","P":"ビタミンA","Q":"ビタミンB1","R":"ビタミンB2","S":"ビタミンC","T":"ビタミンD","U":"ビタミンE"}
    return render_template(
        'nutrition_home.html',nutrition_name = nutrition_name
    )

@app.route('/search_home')
def search_home():
    
    reviews = list(float_range(4.0, 5.0, 0.2))
    f = open('./data/food_list.txt','r', encoding='utf-8')
    foods = f.readlines()
    return render_template(
        'search_home.html',foods = foods,reviews = reviews
    )
    

@app.route('/ans',methods=['GET','POST'])
def ans():
    if request.method == 'POST':
        food_nutrition_amount = pd.read_csv("./data/food_nutritiondata_amount.csv")
        food_nutrition_ratio = pd.read_csv("./data/food_nutritiondata_ratio.csv")
        get_want_most = request.form.get('want_most')
        get_want_second = request.form.get('want_second')
        get_want_third = request.form.get('want_third')
        get_display_method = request.form.get('display_method')
        nutrition_value={"H":60,"I":100,"J":100,"K":20,"L":2000,"M":700,"N":8,"O":9,"P":700,"Q":1.1,"R":1.3,"S":100,"T":8.5,"U":5}
        nutrition_name={"H":"タンパク質","I":"脂質","J":"炭水化物","K":"食物繊維","L":"カリウム","M":"カルシウム","N":"鉄","O":"亜鉛","P":"ビタミンA","Q":"ビタミンB1","R":"ビタミンB2","S":"ビタミンC","T":"ビタミンD","U":"ビタミンE","noname":"選択なし"}
        get_display_method_list={"random":"ランダム","sort1":"栄養価割合（降順）","sort2":"栄養素量実数値（降順）"}
        
        want_most_nutrition = nutrition_name[get_want_most]
        want_second_nutrition = nutrition_name[get_want_second]
        want_third_nutrition = nutrition_name[get_want_third]

        format = get_display_method_list[get_display_method]

        if get_display_method=="random":
            #food_nutrition_amountをコピー
            recipes_df = food_nutrition_amount
            if (get_want_most!="noname"):
                recipes_df = recipes_df[recipes_df[want_most_nutrition] > nutrition_value[get_want_most]]
            if (get_want_second!="noname"):
                recipes_df = recipes_df[recipes_df[want_second_nutrition] > nutrition_value[get_want_second]]
            if (get_want_third!="noname"):
                recipes_df = recipes_df[recipes_df[want_third_nutrition] > nutrition_value[get_want_third]]
            recipes_df = recipes_df.sample(frac=1).reset_index(drop=True)
        elif get_display_method=="sort1":
            #food_nutrition_ratioをコピー
            recipes_df = food_nutrition_ratio
            if (get_want_most!="noname"):
                recipes_df = recipes_df.sort_values(get_want_most)
        else:
            #food_nutrition_amountをコピー
            recipes_df = food_nutrition_amount
            if (get_want_most!="noname"):
                recipes_df = recipes_df.sort_values(get_want_most)

        # 'URL','画像URL','名前'の抽出
        recipes_df = recipes_df.loc[:,['URL','画像URL','名前']]
        # 20個に切り取る   
        if recipes_df.shape[0] >= 20:
            recipes_df = recipes_df[0:20]
        # htmlで取得するためのコラム名の変更
        recipes_df = recipes_df.rename(columns={'URL': 'url', '画像URL': 'image_url', '名前': 'name'} )
        # df型から辞書型へ変換
        recipes = recipes_df.to_dict(orient='records') 
        
        return render_template('ans.html', name1=want_most_nutrition,name2=want_second_nutrition,name3=want_third_nutrition,format=format,recipes=recipes)
    else:
        return render_template('home.html')
    
@app.route('/tec')
def tec():
    return render_template(
        'tec.html'
    )  
@app.route('/explanation')
def explanation():
    return render_template(
        'explanation.html'
    )
    
@app.route('/form')
def form():
    return render_template(
        'form.html'
    )
    
@app.route('/search_ans',methods=['GET','POST'])
def search_ans():
    if request.method == 'POST':
        f = open('./data/food_data.txt','r', encoding='utf-8')
        foods_data = f.readlines()
        
        output_data = []
        select_item = []
        
        review_area_select = request.form.get('review_area_select')
        review_flag = request.form.get('review_flag')
        if review_flag == 'on':
            select_item.append("レビュー: "+review_area_select+" 以上")
        
        cooktime_area_select = request.form.get('cooktime_area_select')
        cooktime_flag = request.form.get('cooktime_flag')
        cooktime_radio = request.form.get('cooktime_radio')
        if cooktime_flag == 'on':
            if cooktime_radio == "1":
                select_item.append("調理時間: "+cooktime_area_select+"分 以上")
            else:
                select_item.append("調理時間: "+cooktime_area_select+"分 以下")
            
        cost_area_select = request.form.get('cost_area_select')
        cost_flag = request.form.get('cost_flag')
        if cost_flag == 'on':
            select_item.append("費用目安: "+cost_area_select+"円 以下")
            
        keyword_area_select = list(request.form.get('keyword_area_select').split('　'))
        keyword_flag = request.form.get('keyword_flag')
        if keyword_flag == 'on':
            select_item.append("キーワード: "+ ' '.join(keyword_area_select))
        
        
        search_food = request.form.getlist('search_food')
        #data = ['URL','レシピ名','画像のパス','レビュー評価','調理時間','費用','材料']
        for data in foods_data:
            data = data.split(',')
            data[-1] = data[-1].replace('\n', '')
            jedge = 1
            if search_food != []:
                for i in range(len(search_food)):
                    if not(search_food[i].replace('\r\n','') in data):
                        jedge = 0
                        break
            if review_flag == 'on':
                if float(data[3]) < float(review_area_select):
                    jedge = 0
            if cooktime_flag == 'on':
                if cooktime_radio == "1":
                    if int(data[4]) < int(cooktime_area_select):
                        jedge = 0
                else:
                    if int(data[4]) > int(cooktime_area_select):
                        jedge = 0
                    
            if cost_flag == 'on':
                if int(data[5]) > int(cost_area_select):
                        jedge = 0
            
            if keyword_flag == 'on':
                if keyword_area_select != []:
                    for keyword in keyword_area_select:
                        if not(keyword in data[1]):
                            jedge = 0
                            break
                        
            if jedge == 1:
                output_data.append(data)
            
        random.shuffle(output_data)     
        return render_template(
            'search_ans.html', output_data = output_data, select_item = select_item, search_food = search_food
        ) 
    else:
        f2 = open('./data_collect/food_list.txt','r')
        foods = f2.readlines()
        return render_template(
            'search_home.html',foods = foods
        )
    
    


    

@app.route('/submit',methods=['POST'])
def submit():
    yourname = request.form['yourname']
    gender = request.form['gender']
    age = request.form['age']
    comment = request.form['comment']
    json_file = 'artful-memento-359808-bf547e15118c.json'
    scope = ['https://spreadsheets.google.com/feeds','https://www.googleapis.com/auth/drive']
    credentials = ServiceAccountCredentials.from_json_keyfile_name(json_file, scope)
    gc = gspread.authorize(credentials)
    wks = gc.open('from').food_nutrition_amount
    
    if request.method == 'POST':
        if comment == "":
            message1="入力してください"
            message2=""
        else: 
            for i in range(2,100,1):
                place1="A"+str(i)
                place2="B"+str(i)
                place3="C"+str(i)
                place4="D"+str(i)
                val1 = wks.acell(place1).value
                val2 = wks.acell(place2).value
                val3 = wks.acell(place3).value
                val4 = wks.acell(place4).value
                if val1 is None and val2 is None and val3 is None and val4 is None:
                    wks.update_acell(place1,yourname)
                    wks.update_acell(place2,gender)
                    wks.update_acell(place3,age)
                    wks.update_acell(place4,comment)
                    message2="送信が完了しました。"
                    message1=""
                    break
        return render_template(
            'form.html',message1=message1,message2=message2
        )
    
@app.route('/how')
def how():
    return render_template(
        'how.html'
    )
@app.route('/pigeon')
def pigeon():
    recipes=[]
    add_row = {"url":"https://www.kurashiru.com/recipe_cards/d6a2a0d8-1de3-4d12-8a69-1c5d98e8614d","name":"ピジョンのパイ包み レシピ・作り方"}
    recipes.append(add_row)
    name1="鳩"
    name2="ピジョン"
    name3="ぽっぽ"
    format="🐦"
    return render_template('ans.html',name1=name1,name2=name2,name3=name3,format=format,recipes=recipes)  
    

if __name__ == "__main__":
    app.run(debug=True)

