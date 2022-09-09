/*
Format correlations to send to React
*/
function formatCorrelations(gene, specie, tissue, qcorr) {
    return new Promise( (resolve, reject) => {
        let corr = {};
        for (let i=0; i<specie.length; i++) {
            let si = specie[i];
            corr[si] = {};
            let fs_qcorr = qcorr.filter( e => si.toLowerCase() == e.organism.toLowerCase() );
            for (let j=0; j<gene.length; j++) {
                gj = gene[j];
                corr[si][gj] = {};
                let fg_fs_qcorr = fs_qcorr.filter( e => gj.toLowerCase() == e.gene.toLowerCase() );
                for (let k=0; k<tissue.length; k++) {
                    tk = tissue[k];
                    let ft_fg_fs_qcorr = fg_fs_qcorr.filter( e => tk.toLowerCase() == e.tissue.toLowerCase() );
                    corr[si][gj][tk] = ft_fg_fs_qcorr.map(
                        e => ( { 
                            values: e.values,  
                        } ) 
                    )[0];
                }
            }
        }
        resolve(corr);
        //return corr;
    })
};

module.exports = formatCorrelations;