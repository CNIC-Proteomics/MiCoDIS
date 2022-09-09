# -*- coding: utf-8 -*-
"""
Created on Mon Sep  5 11:00:11 2022

@author: rbarreror
"""

import pandas as pd
import re
import simplejson

#
# GENE TO CLASS MAKER
# 
infile = r"S:\U_Proteomica\UNIDAD\software\MacrosRafa\data\Proteomics\GroupTools\MiCoDIS\gene2class.xlsx"

df = pd.read_excel(infile)

# Remove NaN
df = df[~df['Class'].isna()].drop_duplicates().copy()

# Remove '_'
cl = [i.replace(u'\xa0', u' ').strip('_ ') for i in df['Class'].to_list()]
cl = [re.sub(r'[_\s]+', ' ', i) for i in cl]

df['Class'] = cl
df = df[df['Class']!='']

df = df.groupby('Class').agg(list)

c2g = df.T.to_dict()

with open(r'S:\U_Proteomica\UNIDAD\software\MacrosRafa\data\Proteomics\GroupTools\MiCoDIS\server\src\db\mus_musculus\c2g.json', 'w') as f:
    simplejson.dump(c2g, f,)


#
# GENE TO COUNT&SCORE
#
infile = r"S:\U_Proteomica\UNIDAD\software\MacrosRafa\data\Proteomics\GroupTools\MiCoDIS\realData.feather"

df = pd.read_feather(infile)
df['count'] = 1

df = df.loc[:, ['protein', 'Gene', 'Tissue', 'Band', 'q_score', 'count']].groupby(['protein', 'Gene', 'Tissue', 'Band']).agg(sum).reset_index()

df1 = pd.pivot_table(df, values='count', index=['Gene', 'protein', 'Tissue'], columns='Band').reset_index()

df2 = pd.pivot_table(df, values='q_score', index=['Gene', 'protein', 'Tissue'], columns='Band').reset_index()

df1.columns = pd.MultiIndex.from_tuples([('count', i) if type(i) == int else ('LEVEL', i) for i in df1.columns])
df2.columns = pd.MultiIndex.from_tuples([('q_score', i) if type(i) == int else ('LEVEL', i) for i in df2.columns])

df = pd.merge(
    df1,
    df2,
    on=[('LEVEL', 'Gene'), ('LEVEL', 'protein'), ('LEVEL', 'Tissue')]
    )

df = df.fillna(0)

df.columns = [f'{i}&{j}' for i,j in df.columns]

df.to_feather(r'S:\U_Proteomica\UNIDAD\software\MacrosRafa\data\Proteomics\GroupTools\MiCoDIS\server\src\db\mus_musculus\gene_count_score.feather')
