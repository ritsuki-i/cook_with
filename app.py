from flask import Flask, request, jsonify
import random
import pandas as pd
from collections import Counter
from sklearn.cluster import KMeans
import numpy as np
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

@app.route('/api/connect', methods=['GET'])
def data_connect():
    return jsonify({"message": 'Connect OK!'})

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

@app.route('/api/ingredients_history_submit', methods=['POST'])
def ingredients_history_submit():
    responsed_data = request.json
    # 受け取ったデータを処理します
    print("Received data:", responsed_data)

    with open('./data/food_data.txt','r', encoding='utf-8') as f:
        foods_data = [line.strip().split(',') for line in f.readlines()]

    output_data = []
    recommend_element = []
    viewed_recipe_urls = []
    
    if len(responsed_data) > 0:
        for i in range(len(responsed_data)):
            recommend_element.extend([item for item in foods_data if item[1] == responsed_data[i]["name"]][0][6:])
            viewed_recipe_urls.append(responsed_data[i]["url"])

        ingredients_counter = Counter(recommend_element)

        # フィルタリングする材料のリスト
        common_ingredients = {'塩こしょう', '水', '料理酒', 'サラダ油', '水溶き片栗粉', '片栗粉'}

        # フィルタリング後のカウンター
        filtered_counter = Counter({k: v for k, v in ingredients_counter.items() if k not in common_ingredients})

        print("フィルタリング後の材料:", filtered_counter)

        # クラスタリング用のデータ準備
        ingredient_names = list(filtered_counter.keys())
        ingredient_values = list(filtered_counter.values())

        # データを2次元配列に変換 (クラスタリングのため)
        X = np.array(ingredient_values).reshape(-1, 1)

        # KMeans クラスタリング
        kmeans = KMeans(n_clusters=3, random_state=0).fit(X)

        # 各材料のクラスタを取得
        labels = kmeans.labels_

        # 結果の表示
        for i, label in enumerate(labels):
            print(f"材料: {ingredient_names[i]}, クラスタ: {label}")

        # クラスタごとの材料をリスト化
        cluster_ingredients = {i: [] for i in range(3)}

        for i, label in enumerate(labels):
            cluster_ingredients[label].append(ingredient_names[i])

        # レコメンドの実行 (ここではクラスタ0の材料を使ったレシピを提案)
        recommended_ingredients = cluster_ingredients[0]
        print("レコメンドするレシピに使用する材料:", recommended_ingredients)

        # レシピの抽出
        def find_top_matching_recipes(foods_data, recommended_ingredients, top_n=3):
            matches = []
            
            for recipe in foods_data:
                recipe_url = recipe[0]  # レシピのURL
                ingredients = recipe[6:]  # 各レシピの材料リスト
                
                # 閲覧履歴に含まれるレシピは除外
                if recipe_url in viewed_recipe_urls:
                    continue
            
                # 材料の共通部分を求める
                match_count = len(set(ingredients) & set(recommended_ingredients))
                matches.append((match_count, recipe))
            
            # 共通材料の数でソートして、上位N件を取得
            top_matches = sorted(matches, key=lambda x: x[0], reverse=True)[:top_n]
            
            return [recipe for _, recipe in top_matches]

        # 抽出結果
        top_recipes = find_top_matching_recipes(foods_data, recommended_ingredients)
        
        for top_recipe in top_recipes:
            data = {}
            data['url'] = top_recipe[0]
            data['name'] = top_recipe[1]
            data['image_url'] = top_recipe[2]
            print(data)
            output_data.append(data)
    else:
        for _ in range(3):
            while True:
                data = {}
                num = random.randint(0, len(foods_data))
                data['url'] = foods_data[num][0]  # 'url'列のデータを取得
                data['name'] = foods_data[num][1]  # 'name'列のデータを取得
                data['image_url'] = foods_data[num][2]  # 'image_url'列のデータを取得
                if (data not in output_data):
                    break
            output_data.append(data)
            
        random.shuffle(output_data)  
        
    # 処理の結果を返す
    response = {
        'status': 'success',
        'output_data' : output_data
    }

    return jsonify(response)

@app.route('/api/nutrition_history_submit', methods=['POST'])
def nutrition_history_submit():
    responsed_data = request.json
    # 受け取ったデータを処理します
    print("Received data:", responsed_data)

    foods_data = pd.read_csv("./data/food_nutritiondata_amount.csv").rename(columns={'URL': 'url', '画像URL': 'image_url', '名前': 'name'} )

    output_data = []
        
    if len(responsed_data) > 0:
        recommended_recipe = {}
        #レシピの閲覧履歴があるときはレコメンド
        # responsed_data を DataFrame に変換
        responsed_df = pd.DataFrame(responsed_data)

        # 一致する name を持つ foods_data の行を抽出
        viewed_data = foods_data[foods_data['name'].isin(responsed_df['name'])] 
        
        # 閲覧履歴から栄養素の合計を計算
        total_nutrients = viewed_data.sum(numeric_only=True)

        # 各栄養素の重みを計算（合計に対する割合）
        total_sum = total_nutrients.sum()
        weights = total_nutrients / total_sum

        # 重みを表示
        print(weights)
        
        # スコアの計算
        def calculate_weighted_score(row, weights):
            score = 0
            for nutrient in weights.index:
                score += row[nutrient] * weights[nutrient]
            return score

        # 各レシピのスコアを計算してDataFrameに追加
        foods_data['score'] = foods_data.apply(calculate_weighted_score, axis=1, weights=weights)

        # スコアが高い順にレシピを並べ替える
        recommended_recipes = foods_data.sort_values(by='score', ascending=False)

        # 上位3つのレシピを出力
        for i in range(3):
            data = {}
            data['url'] = recommended_recipes.iloc[i]['url']  # 'url'列のデータを取得
            data['name'] = recommended_recipes.iloc[i]['name']  # 'name'列のデータを取得
            data['image_url'] = recommended_recipes.iloc[i]['image_url']  # 'image_url'列のデータを取得
            print(data)
            output_data.append(data)
        
    else:    
        #レシピの閲覧履歴がないときはランダム出力
        for _ in range(3):
            while True:
                data = {}
                num = random.randint(0, len(foods_data))
                data['url'] = foods_data[num][0]  # 'url'列のデータを取得
                data['name'] = foods_data[num][1]  # 'name'列のデータを取得
                data['image_url'] = foods_data[num][2]  # 'image_url'列のデータを取得
                if (data not in output_data):
                    break
            output_data.append(data)
            
        random.shuffle(output_data)  
        

    # 処理の結果を返す

    response = {
        'status': 'success',
        'output_data' : output_data
    }

    return jsonify(response)
    

if __name__ == "__main__":
    app.run(debug=True)

