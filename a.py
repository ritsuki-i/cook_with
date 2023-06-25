import re

def delete_quotation(str):
    pattern = r'\([^()]*\)'
    new_str = re.sub(pattern, '', str)
    return new_str

new = delete_quotation('鶏ささみ (計250ｇ)')
print(new)