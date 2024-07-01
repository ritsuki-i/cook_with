from flask import Flask, render_template , request, jsonify
import random
import gspread
from oauth2client.service_account import ServiceAccountCredentials
import pandas as pd
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

@app.route('/api/search_home/food_data', methods=['GET'])
def ingredients_food_data():
    with open('./data/food_list.txt', 'r', encoding='utf-8') as f:
        foods = [line.strip() for line in f.readlines()]
    return jsonify({"foods": foods})

@app.route('/api/ingredients_food_submit', methods=['POST'])
def ingredients_food_submit():
    submit_data = request.json
    # 受け取ったデータを処理します
    print("Received data:", submit_data)

    f = open('./data/food_data.txt','r', encoding='utf-8')
    foods_data = f.readlines()

    output_data = []
    select_item = []

        
    review_area_select = submit_data['val_review']
    review_flag = submit_data['reviewChecked']
    if review_flag == True:
        select_item.append("レビュー: "+str(review_area_select)+" 以上")
        
    cooktime_area_select = submit_data['val_time']
    cooktime_flag = submit_data['cooktimeChecked']
    cooktime_radio = submit_data['upDownToggle']

    if cooktime_flag == True:
        if cooktime_radio == "1":
            select_item.append("調理時間: "+str(cooktime_area_select)+"分 以上")
        else:
            select_item.append("調理時間: "+str(cooktime_area_select)+"分 以下")
            
    cost_area_select = submit_data['val_cost']
    cost_flag = submit_data['costChecked']
    if cost_flag == True:
        select_item.append("費用目安: "+str(cost_area_select)+"円 以下")
            
    keyword_area_select = list(submit_data['serchedFilter'].split('　'))
    keyword_flag = submit_data['keywordChecked']
    if keyword_flag == True:
        select_item.append("キーワード: "+ ' '.join(keyword_area_select))
        
        
    search_food = submit_data['selectedFood']
    #data = ['URL','レシピ名','画像のパス','レビュー評価','調理時間','費用','材料']
    for data in foods_data:
        data = data.split(',')
        data[-1] = data[-1].replace('\n', '')
        jedge = 1
        if search_food != []:
            for i in range(len(search_food)):
                if not(search_food[i]['value'] in data):
                    jedge = 0
                    break
                
        if review_flag == True:
            if float(data[3]) < float(review_area_select):
                jedge = 0
        if cooktime_flag == True:
            if cooktime_radio == '1':
                if int(data[4]) < int(cooktime_area_select):
                    jedge = 0
            else:
                if int(data[4]) > int(cooktime_area_select):
                    jedge = 0
                    
        if cost_flag == True:
            if int(data[5]) > int(cost_area_select):
                    jedge = 0
            
        if keyword_flag == True:
            if keyword_area_select != []:
                for keyword in keyword_area_select:
                    if not(keyword in data[1]):
                        jedge = 0
                        break
                        
        if jedge == 1:
            output_data.append(data)
            
    random.shuffle(output_data)   

    if len(output_data) > 20:
        output_data = output_data[0:20]

    # 処理の結果を返す
    response = {
        'status': 'success',
        'output_data' : output_data
    }

    return jsonify(response)
    
@app.route('/api/nutrition_home/nutrition_data')
def nutrition_data():
    nutrition_name={"H":"タンパク質","I":"脂質","J":"炭水化物","K":"食物繊維","L":"カリウム","M":"カルシウム","N":"鉄","O":"亜鉛","P":"ビタミンA","Q":"ビタミンB1","R":"ビタミンB2","S":"ビタミンC","T":"ビタミンD","U":"ビタミンE"}
    return jsonify(nutrition_name)
    

@app.route('/api/nutrition_food_submit', methods=['POST'])
def nutrition_food_submit():
    submit_data = request.json
    # 受け取ったデータを処理します
    print("Received data:", submit_data)    

    food_nutrition_amount = pd.read_csv("./data/food_nutritiondata_amount.csv")
    food_nutrition_ratio = pd.read_csv("./data/food_nutritiondata_ratio.csv")
    get_want_most = submit_data['wantMost']
    get_want_second = submit_data['wantSecond']
    get_want_third = submit_data['wantThird']
    get_display_method = submit_data['displayMethod']
    nutrition_value={"H":60,"I":100,"J":100,"K":20,"L":2000,"M":700,"N":8,"O":9,"P":700,"Q":1.1,"R":1.3,"S":100,"T":8.5,"U":5}
    nutrition_name={"H":"タンパク質","I":"脂質","J":"炭水化物","K":"食物繊維","L":"カリウム","M":"カルシウム","N":"鉄","O":"亜鉛","P":"ビタミンA","Q":"ビタミンB1","R":"ビタミンB2","S":"ビタミンC","T":"ビタミンD","U":"ビタミンE","nan":"NaN"}
    get_display_method_list={"random":"ランダム","sort1":"栄養価割合（降順）","sort2":"栄養素量実数値（降順）"}
        
    want_most_nutrition = nutrition_name[get_want_most]
    want_second_nutrition = nutrition_name[get_want_second]
    want_third_nutrition = nutrition_name[get_want_third]

    display_method = get_display_method_list[get_display_method]

    if get_display_method=="random":
            #food_nutrition_amountをコピー
        recipes_df = food_nutrition_amount
        if (get_want_most!="nan"):
            recipes_df = recipes_df[recipes_df[want_most_nutrition] > nutrition_value[get_want_most]]
        if (get_want_second!="nan"):
            recipes_df = recipes_df[recipes_df[want_second_nutrition] > nutrition_value[get_want_second]]
        if (get_want_third!="nan"):
            recipes_df = recipes_df[recipes_df[want_third_nutrition] > nutrition_value[get_want_third]]
        recipes_df = recipes_df.sample(frac=1).reset_index(drop=True)
    elif get_display_method=="sort1":
        #food_nutrition_ratioをコピー
        recipes_df = food_nutrition_ratio
        if (get_want_most!="nan"):
            recipes_df = recipes_df.sort_values(want_most_nutrition)
    else:
        #food_nutrition_amountをコピー
        recipes_df = food_nutrition_amount
        if (get_want_most!="nan"):
            recipes_df = recipes_df.sort_values(want_most_nutrition)

    # 'URL','画像URL','名前'の抽出
    recipes_df = recipes_df.loc[:,['URL','画像URL','名前']]
    # 20個に切り取る   
    if recipes_df.shape[0] >= 20:
        recipes_df = recipes_df[0:20]
    # htmlで取得するためのコラム名の変更
    recipes_df = recipes_df.rename(columns={'URL': 'url', '画像URL': 'image_url', '名前': 'name'} )
    # df型から辞書型へ変換
    recipes = recipes_df.to_dict(orient='records') 
    
    # 処理の結果を返す
    response = {
        'status': 'success',
        'output_data' : recipes
    }
    print( 'output_data' , recipes)    


    return jsonify(response)


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

