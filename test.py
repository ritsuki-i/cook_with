import random
import pandas as pd

food_nutrition_amount = pd.read_csv("./data/food_nutritiondata_amount.csv")
food_nutrition_ratio = pd.read_csv("./data/food_nutritiondata_ratio.csv")
get_want_most = 'H'
get_want_second = "K"
get_want_third = "N"
get_display_method = "random"
nutrition_value={"H":60,"I":100,"J":100,"K":20,"L":2000,"M":700,"N":8,"O":9,"P":700,"Q":1.1,"R":1.3,"S":100,"T":8.5,"U":5}
nutrition_name={"H":"タンパク質","I":"脂質","J":"炭水化物","K":"食物繊維","L":"カリウム","M":"カルシウム","N":"鉄","O":"亜鉛","P":"ビタミンA","Q":"ビタミンB1","R":"ビタミンB2","S":"ビタミンC","T":"ビタミンD","U":"ビタミンE","noname":"選択なし"}
get_display_method_list={"random":"ランダム","sort1":"栄養価割合（降順）","sort2":"栄養素量実数値（降順）"}
recipes = []
recipesx = []
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
    if (get_want_second!="noname"):
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
        
dict_list = recipes_df.to_dict(orient='records')
print(dict_list)

# for i in range(2,len(food_nutrition_amount),1):
#     in1 = get_want_most+str(i)
#     in2 = get_want_second+str(i)
#     in3 = get_want_third+str(i)
#     ans1 = "A"+str(i)
#     ans2 = "B"+str(i)
#     if get_display_method=="random":
#         if (get_want_most=="noname" or food_nutrition_amount[in1].value>=nutrition_value[get_want_most]) and (get_want_second=="noname" or food_nutrition_amount[in2].value>=d_a[get_want_second]) and (get_want_third=="noname" or food_nutrition_amount[in3].value>=d_a[get_want_third]):
#             add_row = {"url":food_nutrition_amount[ans1].value,"name":food_nutrition_amount[ans2].value}
#             recipes.append(add_row)
#             random.shuffle(recipes)
#     elif get_display_method=="sort2":
#         if get_want_most=="noname" and get_want_second=="noname" and get_want_third=="noname":
#             add_row = {"url":food_nutrition_amount[ans1].value,"name":food_nutrition_amount[ans2].value}
#             recipes.append(add_row)
#             random.shuffle(recipes)
#         else:
#             add_row1 = {"url":food_nutrition_amount[ans1].value,"name":food_nutrition_amount[ans2].value,"key":int(food_nutrition_amount[in1].value)}
#             recipesx.append(add_row1)
#             recipesx = sorted(recipesx,key=lambda x:x["key"],reverse=True)
#             recipes=recipesx[0:9]
#     else:
#         if get_want_most=="noname" and get_want_second=="noname" and get_want_third=="noname":
#             add_row = {"url":food_nutrition_ratio[ans1].value,"name":food_nutrition_ratio[ans2].value}
#             recipes.append(add_row)
#             random.shuffle(recipes)
#         else:
#             add_row1 = {"url":food_nutrition_ratio[ans1].value,"name":food_nutrition_ratio[ans2].value,"key":food_nutrition_ratio[in1].value}
#             recipesx.append(add_row1)
#             recipesx = sorted(recipesx,key=lambda x:x["key"],reverse=True)
#             recipes=recipesx[0:9]
# print(want_most_nutrition,want_second_nutrition,want_third_nutrition,format,recipes)
