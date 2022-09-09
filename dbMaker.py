#
# import modules
# 

import argparse
import json
from multiprocessing import cpu_count
from multiprocessing import Pool
import multiprocessing
import numpy as np
import pandas as pd
import os
import pickle
import random
import itertools
from itertools import repeat
import logging
import sys

import simplejson

from scipy import stats



#
# Constants
#

args = {
        'infile': r"S:\U_Proteomica\UNIDAD\software\MacrosRafa\data\Proteomics\GroupTools\MiCoDIS\realData.feather",
        'qc': 'protein',
        'gc': 'Gene',
        'pc': 'plain_peptide',
        'tc': 'Tissue',
        'bc': 'Band',
        'sc': 'q_score',
        'outpath': r'S:\U_Proteomica\UNIDAD\software\MacrosRafa\data\Proteomics\GroupTools\MiCoDIS\db\correlations',
        'nthreads': 4,
        'organism': 'mus_musculus'
        }



#
# Functions and Class
#


def SpearmanCalc(dfd_item, args):
    
    tissue, dfd = dfd_item
    
    dfd_out = {
        'freq': {
            'count': pd.pivot_table(dfd, values='count', index=args['gc'], columns=args['bc']).fillna(0),
            args['sc']: pd.pivot_table(dfd, values=args['sc'], index=args['gc'], columns=args['bc']).fillna(0)
            }
        }
    
    genes = dfd_out['freq']['count'].index.to_list()
    
    count_stat = stats.spearmanr(dfd_out['freq']['count'], axis=1)
    score_stat = stats.spearmanr(dfd_out['freq'][args['sc']], axis=1)
    
    df_aux = {}
    
    df_aux['correlation'] = {
        'count': pd.DataFrame(count_stat.correlation, index=genes, columns=genes).round(decimals=4), # dfd_out['freq']['count'].transpose().corr('spearman'),
        args['sc']: pd.DataFrame(score_stat.correlation, index=genes, columns=genes).round(decimals=4) # dfd_out['freq'][args['sc']].transpose().corr('spearman')
        }
    
    df_aux['pvalues'] = {
        'count': pd.DataFrame(count_stat.pvalue, index=genes, columns=genes).round(decimals=4),
        args['sc']: pd.DataFrame(score_stat.pvalue, index=genes, columns=genes).round(decimals=4)
        }
    
    d1, d2, d3, d4 = \
        df_aux['correlation']['count'].to_dict('list'), \
        df_aux['correlation']['q_score'].to_dict('list'), \
        df_aux['pvalues']['count'].to_dict('list'), \
        df_aux['pvalues']['q_score'].to_dict('list')

    #d5 = {i: [{'PSMs':j1, 'score':j2, 'PSMs_pvalue':j3, 'score_pvalue':j4} for j1,j2,j3,j4 in zip(d1[i],d2[i],d3[i],d4[i])] 
    #      for i in d1.keys()}
    d5 = [
        {
            'gene': i,
            'tissue': tissue,
            'organism': args['organism'],
            'values': {j[4]: list(j[:4]) for j in zip(d1[i],d2[i],d3[i],d4[i],d1.keys())}
            }
        for i in d1.keys()
        ]
    

    print(f'Writing json: {tissue}.json')
    with open(rf'S:\U_Proteomica\UNIDAD\software\MacrosRafa\data\Proteomics\GroupTools\MiCoDIS\db\correlations\{tissue}.json', 'w') as f:
        simplejson.dump(d5, f, ignore_nan=True)
    print(f'{tissue}.json written')
    
    #d6 = pd.DataFrame(d5)
    #d6.index = d6.columns
    
    #dfd_out['values'] = d5
    
    return [tissue, dfd_out]

    

def WriteJsonCorr(dfd_item):
    # tissue, dfc, dfs, dfpvalc, dfpvals = dfd_item
    
    # dfc = dfc.to_dict()
    # dfs = dfs.to_dict()
    # pvalc = dfpvalc.to_dict()
    # pvals = dfpvals.to_dict()
    
    # dfc_d = [{'gene': i, 'tissue': tissue, 'organism': args['organism'], 'PSMs': dfc[i]} for i in dfc]
    # #dfs_d = [{'gene': i, 'tissue': tissue, 'organism': args['organism'], 'score': dfs[i]} for i in dfs]
    # dfs_d = [{'score': dfs[i]} for i in dfs]
    # pvalc_d = [{'PSMs_pvalue': pvalc[i]} for i in pvalc]
    # pvalc_s = [{'score_pvalue': pvals[i]} for i in pvals]
    
    # _ = [i.update(**j,**k,**l) for i,j,k,l in zip(dfc_d, dfs_d, pvalc_d, pvalc_s)]
    
    tissue, df = dfd_item
    
    #df = [{'gene': i, 'tissue': tissue, 'organism': args['organism'], 'values': df[i]} for i in df.to_dict()]
    
    with open(rf'S:\U_Proteomica\UNIDAD\software\MacrosRafa\data\Proteomics\GroupTools\MiCoDIS\db\correlations\{tissue}.json', 'w') as f:
        #simplejson.dump(dfc_d, f, ignore_nan=True)
        simplejson.dump(df, f, ignore_nan=True)
        #json.dump(dfc_d, f)

    print(f'{tissue}.json written')


#
# Main Execution
#

if __name__=='__main__':
    
    multiprocessing.freeze_support()
    
    # Read input data
    df = pd.read_feather(args['infile'])
    
    # groupby tissue
    df['count'] = 1
    dfd = {i: j for i,j in df.groupby(args['tc'])}
    
    
    dfd = {
      i: j.loc[:, [
          args['gc'],args['qc'], args['bc'], args['sc'], 'count']
          ].groupby([args['gc'], args['qc'],args['bc']]).agg(sum).reset_index()
     
      for i,j in dfd.items()
      }
    
    
    #
    # Calculate spearman
    #
    print('Spearman...')
    
    # Single thread
    #result = [SpearmanCalc(i,args) for i in list(dfd.items())[:1]]
    

    
    # Multi-thread
    with Pool(processes=args['nthreads']) as pool:
        result = pool.starmap(SpearmanCalc, zip(dfd.items(), repeat(args)))
    
    dfd_out = {i:j for i,j in result}
    sys.exit(0)

    
    #
    # Correlations with json 
    # For each q in T, indicate correlations (with PSMs and score) with the other genes
    print('Correlations json...')
    
    # df_corr = [
    #     [
    #         tissue, 
    #         dfd_out[tissue]['correlation']['count'],  
    #         dfd_out[tissue ]['correlation'][args['sc']],
    #         dfd_out[tissue]['pvalues']['count'],
    #         dfd_out[tissue ]['pvalues'][args['sc']]
    #         ] for tissue in dfd_out.keys()
    #     ]
    
    #df_corr = [[tissue, dfd_out[tissue]['values']] for tissue in dfd_out.keys()]
    
    #with Pool(4) as p:
    #    _ = p.map(WriteJsonCorr, df_corr)
    
    #print('JSON correlations written')
    #sys.exit(0)
    
    #
    # Generate json with q bands information
    # For each q in T, indicate PSMs and scores along their bands
    
    gene2prot = dict(list(set(list(zip(df['Gene'].to_list(), df['protein'].to_list())))))
    
    dfd_bands = [[i, dfd_out[i]['freq']['count'].transpose().to_dict(), dfd_out[i]['freq'][args['sc']].transpose().to_dict()] for i in dfd_out]
        
    dfd_bands_out = [ 
      [
       tissue, 
       [{'gene': i, 'protein':gene2prot[i], 'PSMs': list(dfc[i].values()), 'bands':list(dfc[i].keys()), 'tissue':tissue, 'organism': args['organism']} for i in dfc], #loop each gene
       [{'gene': i, 'protein':gene2prot[i], 'score': list(dfc[i].values()), 'bands':list(dfc[i].keys()), 'tissue':tissue, 'organism': args['organism']} for i in dfs] #loop each gene
       ]
      for tissue, dfc, dfs in dfd_bands 
      ]
    
    
    dfd_bands_out = [
      [
       [i, i.update(j)][0] for i,j in zip(dfc,dfs)
       ]
      for tissue, dfc, dfs in dfd_bands_out
      ]
    
    dfd_bands_out = [j for i in dfd_bands_out for j in i]
    
    with open(r'S:\U_Proteomica\UNIDAD\software\MacrosRafa\data\Proteomics\GroupTools\MiCoDIS\db\q_bands.json', 'w') as f:
        json.dump(dfd_bands_out, f)
        
    
    #
    # Generate json with peptide information
    # For each q in T and B, indicate peptides and their score

    pi = df.drop(['count', 'File'], axis=1).groupby([args['qc'], args['gc'], args['tc'], args['bc']]).agg(list).reset_index()
    
    pi = pi.rename(
        columns={args['sc']:'score', args['gc']:'gene', args['tc']:'tissue', args['sc']:'score', args['bc']:'band',args['pc']:'peptide'}
        )
    
    pi['organism'] = args['organism']
    
    pi = list(pi.transpose().to_dict().values())
    with open(r'S:\U_Proteomica\UNIDAD\software\MacrosRafa\data\Proteomics\GroupTools\MiCoDIS\db\pinfo.json', 'w') as f:
        json.dump(pi, f)
