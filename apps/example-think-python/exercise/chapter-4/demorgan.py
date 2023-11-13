# %%
is_vip_user = True
is_active = False

# transform the boolean expression using De Morgan's Theorem
if not (not is_vip_user or is_active):
    print("Send Email")
else:
    print("Do not send Email")
