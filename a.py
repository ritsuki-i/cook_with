import re

s = "2020年1月1日"
result = re.sub(r"\D", "", s)
print(result)