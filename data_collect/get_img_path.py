#各レシピデータのファイルに画像データを追加する

import csv
import requests
from lxml import html
import pandas as pd

poster_url_list = []

def fetch_image_urls(page_url):
    # URLからWebページの内容を取得
    response = requests.get(page_url)
    # 取得したHTMLを解析する
    tree = html.fromstring(response.content)
    # imgタグのsrc属性を抽出（画像のURLを含む）
    poster_url = tree.xpath('//*[@id="videos_show"]/div/main/article[1]/article/div[1]/div/video/@poster')
    return poster_url

def read_urls_from_csv(csv_file):
    # CSVファイルからURLを読み取る
    with open(csv_file, newline='', encoding='utf-8') as file:
        reader = csv.reader(file)
        next(reader)  # ヘッダー行をスキップ
        # CSVの各行からURLを取得（1列目をURLと仮定）
        urls = [row[0] for row in reader if row]  # 空行を無視
    return urls

def write_to_csv(poster_url_list, csv_file):
    df = pd.read_csv(csv_file)
    df.insert(loc=1, column='画像URL', value=poster_url_list)
    df.to_csv(csv_file, index=None)


csv_file_path = '../data/food_nutritiondata_amount.csv'  # CSVファイル名とパスを適宜設定
website_urls = read_urls_from_csv(csv_file_path)

# 各ウェブサイトの画像URLを抽出
for url in website_urls:
    try:
        images = fetch_image_urls(url)
        for img_url in images:
            poster_url_list.append(img_url)
    except Exception as e:
        print(f"Error fetching images from {url}: {e}")


write_to_csv(poster_url_list, csv_file_path)
print("完了")