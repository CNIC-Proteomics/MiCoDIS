#
# import modules
# 

import argparse
import json
from multiprocessing import cpu_count
from multiprocessing import Pool
import multiprocessing
import pandas as pd
import os
import pickle
import random
from itertools import repeat
import logging
import sys



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
        'outpath': r'S:\U_Proteomica\UNIDAD\software\MacrosRafa\data\Proteomics\GroupTools\MiCoDIS\server\src\data\mus_musculus',
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
    
    dfd_out['correlation'] = {
        'count': dfd_out['freq']['count'].transpose().corr('spearman'),
        args['sc']: dfd_out['freq'][args['sc']].transpose().corr('spearman')
        }
    
    return [tissue, dfd_out]
      
    

def WriteJsonCorr(dfd_item):
    tissue, dfc, dfs = dfd_item
    
    dfc = dfc.to_dict()
    dfs = dfs.to_dict()
    
    dfc_d = [{'gene': i, 'tissue': tissue, 'organism': args['organism'], 'PSMs': dfc[i]} for i in dfc]
    dfs_d = [{'gene': i, 'tissue': tissue, 'organism': args['organism'], 'score': dfs[i]} for i in dfs]
    
    _ = [i.update(j) for i,j in zip(dfc_d, dfs_d)]
    
    with open(rf'S:\U_Proteomica\UNIDAD\software\MacrosRafa\data\Proteomics\GroupTools\MiCoDIS\db\correlations\{tissue}.json', 'w') as f:
        json.dump(dfc_d, f)



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
    result = [SpearmanCalc(i,args) for i in dfd.items()]
    
    # Multi-thread
    with Pool(processes=args['nthreads']) as pool:
        result = pool.starmap(SpearmanCalc, zip(dfd.items(), repeat(args)))
    
    dfd_out = {i:j for i,j in result}
    
    
    #
    # Correlations with json 
    # For each q in T, indicate correlations (with PSMs and score) with the other genes
    print('Correlations json...')
    
    df_corr = [[tissue, dfd_out[tissue]['correlation']['count'],  dfd_out[tissue ]['correlation'][args['sc']]  ] for tissue in dfd_out.keys()]
    
    with Pool(4) as p:
        _ = p.map(WriteJsonCorr, df_corr)
    
    
    
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
