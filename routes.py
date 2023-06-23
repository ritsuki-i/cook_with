import openpyxl as excel
from flask import Flask
from flask import render_template , request
import random
import gspread
from oauth2client.service_account import ServiceAccountCredentials


app = Flask(__name__)

@app.route('/')
def home():
    return render_template(
        'home.html'
    )
    

@app.route('/ans',methods=['GET','POST'])
def ans():
    if request.method == 'POST':
        file_path = "sample.xlsx"
        wb = excel.load_workbook(file_path, data_only=True)
        sheet1 = wb["ans1"]   
        sheet2 = wb["ans2"] 
        get1 = request.form.get('choose1')
        get2 = request.form.get('choose2')
        get3 = request.form.get('choose3')
        get4 = request.form.get('choose4')
        d_a={"H":60,"I":100,"J":100,"K":20,"L":2000,"M":700,"N":8,"O":9,"P":700,"Q":1.1,"R":1.3,"S":100,"T":8.5,"U":5}
        d_b={"H":"タンパク質","I":"脂質","J":"炭水化物","K":"食物繊維","L":"カリウム","M":"カルシウム","N":"鉄","O":"亜鉛","P":"ビタミンA","Q":"ビタミンB1","R":"ビタミンB2","S":"ビタミンC","T":"ビタミンD","U":"ビタミンE","noname":"選択なし"}
        d_c={"random":"ランダム","sort1":"栄養価割合（降順）","sort2":"栄養素量実数値（降順）"}
        recipes = []
        recipesx = []
        name1 = d_b[get1]
        name2 = d_b[get2]
        name3 = d_b[get3]
        if get4==None:
            comment1="※表示形式を選択しないと検索できません"
            return render_template('home.html',comment1=comment1)
        elif (get1=="noname" and get2!="noname" and get3!="noname") or (get1=="noname" and get2!="noname" and get3=="noname") or (get1=="noname" and get2=="noname" and get3!="noname"):
            comment2="※ステップ2を選択する場合、ステップ１を選択してください"
            return render_template('home.html',comment2=comment2)
        else:
            format = d_c[get4]
            for i in range(2,100,1):
                in1 = get1+str(i)
                in2 = get2+str(i)
                in3 = get3+str(i)
                ans1 = "A"+str(i)
                ans2 = "B"+str(i)
                if get4=="random":
                    if (get1=="noname" or sheet1[in1].value>=d_a[get1]) and (get2=="noname" or sheet1[in2].value>=d_a[get2]) and (get3=="noname" or sheet1[in3].value>=d_a[get3]):
                        add_row = {"url":sheet1[ans1].value,"name":sheet1[ans2].value}
                        recipes.append(add_row)
                        random.shuffle(recipes)
                elif get4=="sort2":
                    if get1=="noname" and get2=="noname" and get3=="noname":
                        add_row = {"url":sheet1[ans1].value,"name":sheet1[ans2].value}
                        recipes.append(add_row)
                        random.shuffle(recipes)
                    else:
                        add_row1 = {"url":sheet1[ans1].value,"name":sheet1[ans2].value,"key":int(sheet1[in1].value)}
                        recipesx.append(add_row1)
                        recipesx = sorted(recipesx,key=lambda x:x["key"],reverse=True)
                        recipes=recipesx[0:9]
                else:
                    if get1=="noname" and get2=="noname" and get3=="noname":
                        add_row = {"url":sheet2[ans1].value,"name":sheet2[ans2].value}
                        recipes.append(add_row)
                        random.shuffle(recipes)
                    else:
                        add_row1 = {"url":sheet2[ans1].value,"name":sheet2[ans2].value,"key":sheet2[in1].value}
                        recipesx.append(add_row1)
                        recipesx = sorted(recipesx,key=lambda x:x["key"],reverse=True)
                        recipes=recipesx[0:9]
            return render_template('ans.html', name1=name1,name2=name2,name3=name3,format=format,recipes=recipes)
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
    wks = gc.open('from').sheet1
    
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

