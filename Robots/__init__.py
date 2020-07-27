from .MrGreed import MrGreed
from .MrIf import MrIf
from .MrRandom import MrRandom
from .MrSMG.MrSMG import MrSMG

robot_list = [MrGreed,MrIf,MrRandom,MrSMG]
robot_dict = dict([(rb.family_name(),rb) for rb in robot_list])
