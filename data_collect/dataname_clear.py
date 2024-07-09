import csv

# 入力ファイルと出力ファイルの名前
input_file = '../data/food_nutritiondata_ratio.csv'
output_file = 'output.csv'

try:
    with open(input_file, mode='r', encoding='utf-8') as infile, open(output_file, mode='w', newline='', encoding='utf-8') as outfile:
        reader = csv.reader(infile)
        writer = csv.writer(outfile)

        # ヘッダーを読み込んで書き込む
        try:
            header = next(reader)
        except StopIteration:
            print("入力ファイルが空です。")
            raise

        writer.writerow(header)

        # '名前'カラムのインデックスを取得
        name_index = header.index('名前')

        # 各行を処理
        for row in reader:
            # '名前'カラムの要素を置換
            row[name_index] = row[name_index].replace('　レシピ・作り方', '')
            # 新しい行を書き込む
            writer.writerow(row)

except FileNotFoundError:
    print(f"ファイル {input_file} が見つかりません。")
except Exception as e:
    print(f"エラーが発生しました: {e}")