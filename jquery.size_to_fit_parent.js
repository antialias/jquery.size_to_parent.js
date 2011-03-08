$.fn.size_to_fit_parent = function(options) {
	var defaults = {
		min_fs: 3,
		max_fs: 50,
		max_enlarge_scale: 10,
		el_tol: 0.009,
		converge_tol: 0.00001,
		white_space: "nowrap",
		debug: false
	};
	options = $.extend(defaults, options);
	return $(this).each(function() {
		if ($(this).data('autosizing')) {
			return false;
		}
		var ocw, opw, pw, cw, ap = $(this).parent(), done=false, that=this, fs_min, fs_max, last_set_to, num_iter=0, log_pw;

		$(this).data('autosizing', true);
		$(this).css("white-space", options.white_space);

		pw = opw = ap.width();
		cw = ocw = $(this).width();
		log_pw = Math.log(pw);
		if (Math.abs(Math.log(cw) / log_pw - 1) < options.el_tol) {
			reason = "child width = parent width within tolerance";
			done = true;
		}
		if (done) {
			if (options.debug) {
				console.log("done because " + reason);
			}
			$(this).data('autosizing', false);
			return false;
		}

		if (cw > pw) {
			fs_max = parseFloat($(that).css('font-size').replace("px", ""));
			fs_min = options.min_fs;
		} else {
			fs_min = parseFloat($(that).css('font-size').replace("px", ""));
			fs_max = fs_min * options.max_enlarge_scale;
		}
		while (true) {
			++num_iter;
			newsize = (fs_max + fs_min) / 2;

			$(that).css('font-size', newsize.toString() + "px");
			last_set_to = newsize;
			cw = $(that).width();
			if (Math.abs(Math.log(cw) / log_pw - 1) < options.el_tol) {
				reason = "child width = parent width within tolerance";
				done = true;
			}
			if (num_iter > 15) {
				reason = "maximum iterations of " + num_iter + " reached";
				done = true;
			}
			if (!done) {
				if (pw > cw) {
					// we need to increase font size;
					fs_min = newsize;
					if (options.debug) {
						console.log("increasing");
					}
				} else {
					// we need to decrease font size
					fs_max = newsize;
					if (options.debug) {
						console.log("decreasing");
					}
				}
				if (Math.abs(Math.log(fs_max) / Math.log(fs_min) - 1) < options.converge_tol) {
					reason = "min and max font sizes converged within tolerance";
					done = true;
				}
				if (fs_max <= options.min_fs) {
					reason = "min font size of " + options.min_fs + " reached";
					newsize = options.min_fs;
					$(that).css('font-size', newsize.toString() + "px");
					last_set_to = newsize;
					
					done = true;
				}
				if (fs_min >= options.max_fs) {
					reason = "max font size of " + options.max_fs + " reached";
					newsize = options.max_fs;
					$(that).css('font-size', newsize.toString() + "px");
					last_set_to = newsize;

					done = true;
				}
			}
			if (done) {
				if (options.debug) {
					console.log("done because " + reason);
					console.log("it took " + num_iter + " iterations");
					console.log("for this");
					console.log(this);
					console.log("final font size = " + last_set_to);
					console.log("to fit inside " + pw + " pixels");
				}
				$(this).data('autosizing', false);
				return;
			}
		}
	});
};